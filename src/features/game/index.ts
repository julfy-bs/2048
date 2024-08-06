import { Config, GameConstruct, getRandomCoords, TMap } from '../../app';
import { Board } from '../../shared/ui/components/board';
import { Cell } from '../../shared/ui/components/cell';
import { Score } from '../../shared/ui/components/score';
import { Tile } from '../../shared/ui/components/tile';

export type GameConstructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
  engine: GameConstruct;
}

enum GameStatus {
  OVER = 'over',
  CONTINUES = 'continues',
  NEW = 'new'
}

/**
 * @class Game
 * @description Создает объект игры.
 */
export class Game {
  gameStatus: GameStatus.OVER | GameStatus.CONTINUES | GameStatus.NEW;
  isCreatingTilesAvailable: boolean;
  score: number;
  _engine: GameConstruct;
  readonly _ctx: CanvasRenderingContext2D;
  readonly _config: Config;
  private moveCounter: number;
  private _nativeStopper: boolean;
  private _oldX: number;
  private _oldY: number;
  private _gameCached: boolean;
  private readonly _cache: TMap[][] | null;
  private bestScore: number;

  constructor({
    ctx,
    config,
    engine,
  }: GameConstructor) {
    this._ctx = ctx;
    this._config = config;
    this.score = JSON.parse(localStorage.getItem('score')) ?? 0;
    this.bestScore = JSON.parse(localStorage.getItem('bestScore')) ?? 0;
    this.moveCounter = 0;
    this._nativeStopper = false;
    this._engine = engine;
    this._oldX = 0;
    this._oldY = 0;
    this._cache = JSON.parse(localStorage.getItem('cache')) ?? null;
    // this._cache = null;
  }

  public start() {
    if (this._cache !== null && this.score !== 0) {
      this._gameCached = true;
    }
    this._startFirstRound();
    this.gameStatus = GameStatus.CONTINUES;
    this._addEventListeners();
  }

  private create() {
    const {
      cell: createCell,
      tile: createTile,
      board: createBoard,
      score: createScore,
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
      tile: (): Tile => {
        let newTile: Tile;
        let isTileCreated = false;

        while (!isTileCreated && this.isCreatingTilesAvailable) {
          newTile = createTile({
            ctx: this._ctx,
            coordinates: [
              getRandomCoords(0, this._config.game.size),
              getRandomCoords(0, this._config.game.size),
            ],
            value: getRandomCoords(0, 100) > 90 ? 4 : 2,
            config: this._config,
          });
          const isCellAvailable: boolean = this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]].value === null;
          if (isCellAvailable
            && !this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]]?.value
          ) {
            this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]].value = newTile.value;
            isTileCreated = true;
          } else if (!isCellAvailable && !this.isCreatingTilesAvailable) {
            this.gameStatus = GameStatus.OVER;
            console.log(this.gameStatus);
          }
        }

        this._findFreeCells();
        return newTile;
      },
      score: (): Score => {
        return createScore({
          ctx: this._ctx,
          config: this._config,
          position: this._config.score.score.position,
          value: this.score,
          title: 'Score'
        });
      },
      bestScore: (): Score => {
        return createScore({
          ctx: this._ctx,
          config: this._config,
          position: this._config.score.bestScore.position,
          value: this.bestScore,
          title: 'Best score'
        });
      },
    };
  }

  private _findFreeCells(): void {
    const freeCells = [];

    for (let x = 0; x < this._config.board.map.length; x++) {
      for (let y = 0; y < this._config.board.map.length; y++) {
        if (this._config.board.map[x][y].value === null) {
          freeCells.push([x, y]);
        }
      }
    }
    this.isCreatingTilesAvailable = freeCells.length > 0;
  }

  private _draw() {
    const {
      board: createBoard,
      cell: createCell,
      score: createScore,
      bestScore: createBestScore,
    } = this.create();
    const { tile: createTile } = this._engine;
    return {
      board: (): void => {
        createBoard()
          .draw();
      },
      cell: (): void => {
        const cells = createCell();
        cells.forEach((cell: Cell) => cell.draw());
      },
      tiles: () => {
        for (let y = 0; y < this._config.board.map.length; y++) {
          for (let x = 0; x < this._config.board.map.length; x++) {
            if (this._config.board.map[y][x].value !== null) {
              const newTile = createTile({
                ctx: this._ctx,
                config: this._config,
                coordinates: this._config.board.map[y][x].coordinates,
                value: this._config.board.map[y][x].value,
              });
              newTile.draw();
            }
          }
        }
      },
      score: (): void => {
        createScore()
          .draw();
      },
      bestScore: (): void => {
        createBestScore()
          .draw();
      },
    };
  }

  private _checkScore() {
    console.log(this.score, this.bestScore);
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  private _controller() {
    let isPositionChanged = false;
    return {
      up: () => {
        for (let y = 0; y < this._config.game.size; y++) {
          for (let x = 1; x < this._config.game.size; x++) {
            if (this._config.board.map[x][y]?.value) {
              let row = x;
              while (row > 0) {
                if (!this._config.board.map[row - 1][y].value) {

                  this._config.board.map[row - 1][y].value = this._config.board.map[row][y].value;
                  this._config.board.map[row][y].value = null;
                  isPositionChanged = true;
                  row--;
                } else if (this._config.board.map[row - 1][y].value === this._config.board.map[row][y].value) {
                  this._config.board.map[row - 1][y].value *= 2;
                  this.score += this._config.board.map[row - 1][y].value;
                  this._config.board.map[row][y].value = null;
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
                  this._config.board.map[x][column + 1].value = this._config.board.map[x][column].value;
                  this._config.board.map[x][column].value = null;
                  isPositionChanged = true;
                  column++;
                } else if (this._config.board.map[x][column + 1].value === this._config.board.map[x][column].value) {
                  this._config.board.map[x][column + 1].value *= 2;
                  this.score += this._config.board.map[x][column + 1].value;
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
                  this._config.board.map[row + 1][y].value = this._config.board.map[row][y].value;
                  this._config.board.map[row][y].value = null;
                  isPositionChanged = true;
                  row++;
                } else if (this._config.board.map[row + 1][y].value === this._config.board.map[row][y].value) {
                  this._config.board.map[row + 1][y].value *= 2;
                  this.score += this._config.board.map[row + 1][y].value;
                  this._config.board.map[row][y].value = null;
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
                  this._config.board.map[x][column - 1].value = this._config.board.map[x][column].value;
                  this._config.board.map[x][column].value = null;
                  isPositionChanged = true;
                  column--;
                } else if (this._config.board.map[x][column - 1].value === this._config.board.map[x][column].value) {
                  this._config.board.map[x][column - 1].value *= 2;
                  this.score += this._config.board.map[x][column - 1].value;
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

  private _handleKeyboardEvents = (e: KeyboardEvent): void => {
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

  private _handleMouseDownEvent(e: MouseEvent): void {
    this._oldY = e.pageY;
    this._oldX = e.pageX;
  }

  private _handleDirection(deltaX: number, deltaY: number): void {
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

  private _handleMouseUpEvent(e: MouseEvent): void {
    let deltaX = this._oldX - e.pageX;
    let deltaY = this._oldY - e.pageY;
    this._handleDirection(deltaX, deltaY);
  }

  private _handleTouchStartEvent(e: TouchEvent): void {
    this._oldX = Math.floor(e.changedTouches[0].pageX);
    this._oldY = Math.floor(e.changedTouches[0].pageY);
  }

  private _handleTouchEndEvent(e: TouchEvent): void {
    let deltaX = this._oldX - Math.floor(e.changedTouches[0].pageX);
    let deltaY = this._oldY - Math.floor(e.changedTouches[0].pageY);
    this._handleDirection(deltaX, deltaY);
  }

  private _addEventListeners(): void {
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

  private _downloadGameData(): void {
    this._checkScore();
    for (let x = 0; x < this._config.board.map.length; x++) {
      for (let y = 0; y < this._config.board.map.length; y++) {
        this._config.board.map[x][y].value = this._cache[x][y].value;
      }
    }
    this._draw()
      .tiles();
  }

  private _startFirstRound(): void {
    this._findFreeCells();

    if (this._gameCached) {
      this._downloadGameData();
    } else {
      this.score = 0;
      this.create()
        .tile();
      this.create()
        .tile();
    }
    this._draw()
      .score();
    this._draw()
      .bestScore();
    this._draw()
      .board();
    this._draw()
      .cell();
    this._draw()
      .tiles();
  }

  private update(): void {
    localStorage.setItem('cache', JSON.stringify(this._config.board.map));
    localStorage.setItem('score', JSON.stringify(this.score));
    localStorage.setItem('bestScore', JSON.stringify(this.bestScore));
    this.cleanGame();
    this._checkScore();
    this._draw()
      .score();
    this._draw()
      .bestScore();
    this._draw()
      .board();
    this._draw()
      .cell();
    this._draw()
      .tiles();
    this._nativeStopper = false;
  }

  private cleanGame(): void {
    this._ctx.clearRect(0, 0, this._config.board.size, this._config.board.size);
  }
}
