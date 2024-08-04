import { Config, Coordinates, GameConstruct, getRandomCoords, TMap } from '../../app';
import { Board } from '../../shared/ui/components/board';
import { Cell } from '../../shared/ui/components/cell';
import { Tile } from '../../shared/ui/components/tile';

export type GameConstructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
  engine: GameConstruct;
}

/**
 * @class Game
 * @description Создает объект игры.
 */
export class Game {
  gameStatus: 'over' | 'continues';
  isCreatingTilesAvailable: boolean;
  score: number;
  _engine: GameConstruct;
  _cache: TMap[][] | null;
  readonly _ctx: CanvasRenderingContext2D;
  readonly _config: Config;
  private freeCells: Coordinates[];
  private moveCounter: number;
  private _nativeStopper: boolean;
  private _oldX: number;
  private _oldY: number;
  private _tiles: Tile[];
  private _gameCached: boolean;

  constructor({
    ctx,
    config,
    engine,
  }: GameConstructor) {
    this._ctx = ctx;
    this._config = config;
    this.freeCells = [];
    this.isCreatingTilesAvailable = this.freeCells.length > 0;
    this.score = 0;
    this.moveCounter = 0;
    this._nativeStopper = false;
    this._engine = engine;
    this._oldX = 0;
    this._oldY = 0;
    this._cache = null;
    // JSON.parse(localStorage.getItem('cache')) ??
    this._tiles = [];
    console.log(JSON.stringify(this._cache), JSON.parse(localStorage.getItem('cache')));
  }

  public start() {
    if (this._cache !== null) {
      this._gameCached = true;
    }
    this._startFirstRound();
    this.gameStatus = 'continues';
    this._addEventListeners();
    console.log(this._tiles);
  }

  protected create() {
    const {
      cell: createCell,
      tile: createTile,
      board: createBoard,
    } = this._engine;

    return {
      board: (): Board => {
        return createBoard({
          ctx: this._ctx,
          config: this._config,
        });
      },
      cell: (): Cell[] => {
        const cells: Cell[] = [];
        for (let x = 0; x < this._config.board.map.length; x++) {
          for (let y = 0; y < this._config.board.map.length; y++) {
            const newCell = createCell({
              ctx: this._ctx,
              size: this._config.cell.size,
              config: this._config,
              coordinates: this._config.board.map[x][y].coordinates,
            });
            cells.push(newCell);
          }
        }

        return cells;
      },
      // TODO: Тип
      tile: ({ coordinates, value }: { coordinates?: number[], value?: number } = {
        coordinates: null,
        value: null,
      }): Tile => {
        let newTile: Tile;
        let isTileCreated = false;

        while (!isTileCreated && this.isCreatingTilesAvailable) {
          newTile = createTile({
            ctx: this._ctx,
            coordinates: coordinates || [
              getRandomCoords(0, this._config.game.size),
              getRandomCoords(0, this._config.game.size),
            ],
            value: value || getRandomCoords(0, 100) > 90 ? 4 : 2,
            config: this._config,
          });
          const isCellAvailable: boolean = this.freeCells.some((coordinates: Coordinates) => coordinates.toString() === newTile.coordinates.toString());
          if (isCellAvailable
            && !this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]]?.value
          ) {
            this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]].value = newTile.value;
            newTile.changeId(this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]].id);
            isTileCreated = true;
            this._tiles.push(newTile);
          } else if (!isCellAvailable && !this.isCreatingTilesAvailable) {
            this.gameStatus = 'over';
            console.log(this.gameStatus);
          }
        }

        this._findFreeCells();
        return newTile;
      },
      // TODO: баг с координатами
      tiles: (tiles: TMap[][]) => {
        for (let x = 0; x < tiles.length; x++) {
          for (let y = 0; y < tiles.length; y++) {
            if (tiles[x][y].value !== null) {
              const newTile = createTile({
                ctx: this._ctx,
                config: this._config,
                coordinates: tiles[x][y].coordinates,
                value: tiles[x][y].value,
              });
              this._tiles.push(newTile);
            }
          }
        }
      },
    };
  }

  protected _findFreeCells(): void {
    this.freeCells = [];
    for (let x = 0; x < this._config.board.map.length; x++) {
      for (let y = 0; y < this._config.board.map.length; y++) {
        if (this._config.board.map[x][y].value === null) {
          this.freeCells.push([x, y]);
        }
      }
    }
    this.isCreatingTilesAvailable = this.freeCells.length > 0;
  }

  protected _draw() {
    const { board: createBoard, cell: createCell } = this.create();
    return {
      board: (): void => {
        createBoard()
          .draw();
      },
      cell: (): void => {
        const cells = createCell();
        cells.forEach((cell: Cell) => cell.draw());
      },
      tile: (): void => {
        this._tiles.forEach(tile => {
          tile.changeId(this._config.board.map[tile.coordinates[0]][tile.coordinates[1]].id);
          tile.draw();
        });
      },
    };
  }

  protected _controller() {
    let isPositionChanged = false;
    return {
      up: () => {
        for (let y = 0; y < this._config.game.size; y++) {
          for (let x = 1; x < this._config.game.size; x++) {
            if (this._config.board.map[x][y]?.value) {
              let row = x;
              while (row > 0) {
                if (!this._config.board.map[row - 1][y].value) {
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[row][y].id;
                  });
                  this._config.board.map[row - 1][y].value = this._config.board.map[row][y].value;
                  currentTile.changePosition([row - 1, y]);
                  currentTile.changeId(this._config.board.map[row - 1][y].id);
                  this._config.board.map[row][y].value = null;
                  isPositionChanged = true;
                  row--;
                } else if (this._config.board.map[row - 1][y].value === this._config.board.map[row][y].value) {
                  let prevTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[row - 1][y].id;
                  });
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[row][y].id;
                  });
                  prevTile.changeValue();
                  this._config.board.map[row - 1][y].value *= 2;
                  prevTile.changeId(this._config.board.map[row - 1][y].id);
                  this.score += this._config.board.map[row - 1][y].value;
                  this._config.board.map[row][y].value = null;
                  this._tiles = this._tiles.filter(item => item.id !== currentTile.id);
                  isPositionChanged = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        if (isPositionChanged) {
          this.moveCounter++;
          this._nativeStopper = true;
          this.create()
            .tile();
        }
      },
      right: () => {
        for (let x = 0; x < this._config.game.size; x++) {
          for (let y = this._config.game.size - 2; y >= 0; y--) {
            let column = y;
            if (this._config.board.map[x][y]?.value) {
              while (column + 1 < this._config.game.size) {
                if (!this._config.board.map[x][column + 1]?.value) {
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[x][column].id;
                  });
                  this._config.board.map[x][column + 1].value = this._config.board.map[x][column].value;
                  currentTile.changePosition([x, column + 1]);
                  currentTile.changeId(this._config.board.map[x][column + 1].id);
                  this._config.board.map[x][column].value = null;
                  isPositionChanged = true;
                  column++;
                } else if (this._config.board.map[x][column + 1].value === this._config.board.map[x][column].value) {
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[x][column].id;
                  });
                  let nextTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[x][column + 1].id;
                  });
                  nextTile.changeValue();
                  this._config.board.map[x][column + 1].value *= 2;
                  nextTile.changeId(this._config.board.map[x][column + 1].id);
                  this.score += this._config.board.map[x][column + 1].value;
                  this._tiles = this._tiles.filter(item => item.id !== currentTile.id);
                  this._config.board.map[x][column].value = null;
                  isPositionChanged = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        if (isPositionChanged) {
          this.moveCounter++;
          this._nativeStopper = true;
          this.create()
            .tile();
        }
      },
      down: () => {
        for (let y = 0; y < this._config.game.size; y++) {
          for (let x = this._config.game.size - 2; x >= 0; x--) {
            let row = x;
            if (this._config.board.map[x][y].value) {
              while (row + 1 < this._config.game.size) {
                if (!this._config.board.map[row + 1][y].value) {
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[row][y].id;
                  });
                  this._config.board.map[row + 1][y].value = this._config.board.map[row][y].value;
                  currentTile.changePosition([row + 1, y]);
                  currentTile.changeId(this._config.board.map[row + 1][y].id);
                  this._config.board.map[row][y].value = null;
                  isPositionChanged = true;
                  row++;
                } else if (this._config.board.map[row + 1][y].value === this._config.board.map[row][y].value) {
                  let nextTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[row + 1][y].id;
                  });
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[row][y].id;
                  });
                  nextTile.changeValue();
                  this._config.board.map[row + 1][y].value *= 2;
                  nextTile.changeId(this._config.board.map[row + 1][y].id);
                  this.score += this._config.board.map[row + 1][y].value;
                  this._config.board.map[row][y].value = null;
                  this._tiles = this._tiles.filter(item => item.id !== currentTile.id);
                  isPositionChanged = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        if (isPositionChanged) {
          this.moveCounter++;
          this._nativeStopper = true;
          this.create()
            .tile();
        }
      },
      left: () => {
        for (let x = 0; x < this._config.game.size; x++) {
          for (let y = 1; y < this._config.game.size; y++) {
            let column = y;
            if (this._config.board.map[x][y].value) {
              while (column > 0) {
                if (!this._config.board.map[x][column - 1].value) {
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[x][column].id;
                  });
                  this._config.board.map[x][column - 1].value = this._config.board.map[x][column].value;
                  this._config.board.map[x][column].value = null;
                  currentTile.changePosition([x, column - 1]);
                  currentTile.changeId(this._config.board.map[x][column - 1].id);
                  isPositionChanged = true;
                  column--;
                } else if (this._config.board.map[x][column - 1].value === this._config.board.map[x][column].value) {
                  let currentTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[x][column].id;
                  });
                  let prevTile: Tile = this._tiles.find((item: Tile) => {
                    return item.id === this._config.board.map[x][column - 1].id;
                  });
                  prevTile.changeValue();
                  this._config.board.map[x][column - 1].value *= 2;
                  prevTile.changeId(this._config.board.map[x][column - 1].id);
                  this.score += this._config.board.map[x][column - 1].value;
                  this._tiles = this._tiles.filter(item => item.id !== currentTile.id);
                  this._config.board.map[x][column].value = null;
                  isPositionChanged = true;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        if (isPositionChanged) {
          this.moveCounter++;
          this._nativeStopper = true;
          this.create()
            .tile();
        }
      },
    };
  }

  protected _handleKeyboardEvents = (e: KeyboardEvent): void => {
    const { up, down, left, right } = this._controller();
    if (e.key === 'ArrowUp') {
      if (!this._nativeStopper) {
        up();
      }
      this.update();
    }
    if (e.key === 'ArrowRight') {
      if (!this._nativeStopper) {
        right();
      }
      this.update();
    }
    if (e.key === 'ArrowDown') {
      if (!this._nativeStopper) {
        down();
      }
      this.update();
    }
    if (e.key === 'ArrowLeft') {
      if (!this._nativeStopper) {
        left();
      }
      this.update();
    }
  };

  protected _handleMouseDownEvent(e: MouseEvent): void {
    this._oldY = e.pageY;
    this._oldX = e.pageX;
  }

  protected _handleDirection(deltaX: number, deltaY: number): void {
    const { up, down, left, right } = this._controller();

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        if (!this._nativeStopper) {
          left();
        }
        this.update();
      } else if (deltaX < 0) {
        if (!this._nativeStopper) {
          right();
        }
        this.update();
      }
    } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
      if (deltaY > 0) {
        if (!this._nativeStopper) {
          up();
        }
        this.update();
      } else if (deltaY < 0) {
        if (!this._nativeStopper) {
          down();
        }
        this.update();
      }
    } else {
      return;
    }
  }

  protected _handleMouseUpEvent(e: MouseEvent): void {
    let deltaX = this._oldX - e.pageX;
    let deltaY = this._oldY - e.pageY;
    this._handleDirection(deltaX, deltaY);
  }

  protected _handleTouchStartEvent(e: TouchEvent): void {
    this._oldX = Math.floor(e.changedTouches[0].pageX);
    this._oldY = Math.floor(e.changedTouches[0].pageY);
  }

  protected _handleTouchEndEvent(e: TouchEvent): void {
    let deltaX = this._oldX - Math.floor(e.changedTouches[0].pageX);
    let deltaY = this._oldY - Math.floor(e.changedTouches[0].pageY);
    this._handleDirection(deltaX, deltaY);
  }

  protected _addEventListeners(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => this._handleKeyboardEvents(e));

    window.addEventListener(
      'mousedown',
      (e: MouseEvent) => this._handleMouseDownEvent(e),
    );

    window.addEventListener(
      'mouseup',
      (e: MouseEvent) => this._handleMouseUpEvent(e),
    );

    window.addEventListener(
      'touchstart',
      (e: TouchEvent) => this._handleTouchStartEvent(e),
    );

    window.addEventListener(
      'touchend',
      (e: TouchEvent) => this._handleTouchEndEvent(e),
    );
  }

  protected _downloadGameData(): void {
    this.create()
      .tiles(this._cache);
    this._config.board.map = this._cache;
    console.error('wtf');
    console.log(this._tiles);
    console.log(this._config.board.map);
  }

  private _startFirstRound(): void {
    this._findFreeCells();

    if (this._gameCached) {
      this._downloadGameData();
    } else {
      this.create()
        .tile();
      this.create()
        .tile();
    }
    this._draw()
      .board();
    this._draw()
      .cell();
    this._draw()
      .tile();
  }

  private update() {
    localStorage.setItem('cache', JSON.stringify(this._config.board.map));
    this.cleanGame();
    this._draw()
      .board();
    this._draw()
      .cell();
    this._draw()
      .tile();
    this._nativeStopper = false;
    console.log(this._tiles);
    console.log(this._config.board.map);
    console.log(this.score);
    console.log(this.moveCounter);
    console.log(this.gameStatus);
  }

  private cleanGame(): void {
    this._ctx.clearRect(0, 0, this._config.board.size, this._config.board.size);
  }
}
