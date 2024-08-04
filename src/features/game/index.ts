import { Config, Coordinates, GameConstruct, getRandomCoords } from '../../app';
import { Board } from '../../shared/ui/components/board';
import { Cell } from '../../shared/ui/components/cell';
import { Tile } from '../../shared/ui/components/tile';
import { TMap } from '../../app';

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
  engine: GameConstruct;
  _cache: TMap[];
  readonly _ctx: CanvasRenderingContext2D;
  readonly _config: Config;
  private freeCells: Coordinates[];
  private moveCounter: number;
  private nativeStopper: boolean;

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
    this.nativeStopper = false;
    this.engine = engine;
  }

  start() {
    this.startFirstRound();
    this.gameStatus = 'continues';
    this.addControls();
    this._cache = this._iterateMatrix(this._config.board.map);
    console.log(this._cache, this._config.board.map);
  }

  create() {
    const {
      cell: createCell,
      tile: createTile,
      board: createBoard,
    } = this.engine;

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
              coordinates: [x, y],
            });
            cells.push(newCell);
          }
        }

        return cells;
      },
      tile: (): Tile => {
        let newTile: Tile;
        let isTileCreated = false;

        while (!isTileCreated && this.freeCells.length > 0) {
          newTile = createTile({
            ctx: this._ctx,
            coordinates: [
              getRandomCoords(0, this._config.game.size),
              getRandomCoords(0, this._config.game.size),
            ],
            value: getRandomCoords(0, 100) > 90 ? 4 : 2,
            config: this._config,
          });
          const isCellAvailable: boolean = this.freeCells.some((coordinates: Coordinates) => coordinates.toString() === newTile.coordinates.toString());
          if (isCellAvailable
            && !this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]]?.value
          ) {
            this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]].value = newTile;
            isTileCreated = true;
          } else if (!isCellAvailable && this.freeCells.length === 0) {
            this.gameStatus = 'over';
          }
        }

        this.findFreeCells();
        return newTile;
      },
    };
  }

  findFreeCells() {
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

  protected draw() {
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
        for (let x = 0; x < this._config.board.map.length; x++) {
          for (let y = 0; y < this._config.board.map.length; y++) {
            if (this._config.board.map[x][y]?.value !== null) {
              this._config.board.map[x][y]?.value.draw();
            }
          }
        }
      },
    };
  }

  protected addControls() {
    const { up, down, left, right } = this.controller();
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (!this.nativeStopper) {
          up();
        }
        this.update();
      }
      if (e.key === 'ArrowRight') {
        if (!this.nativeStopper) {
          right();
        }
        this.update();
      }
      if (e.key === 'ArrowDown') {
        if (!this.nativeStopper) {
          down();
        }
        this.update();
      }
      if (e.key === 'ArrowLeft') {
        if (!this.nativeStopper) {
          left();
        }
        this.update();
      }
    });
  }

  protected controller() {
    return {
      up: () => {
        for (let y = 0; y < this._config.game.size; y++) {
          for (let x = 1; x < this._config.game.size; x++) {

            if (this._config.board.map[x][y]?.value) {
              let row = x;
              while (row > 0) {
                if (!this._config.board.map[row - 1][y].value) {
                  this._config.board.map[row - 1][y].value = this._config.board.map[row][y]?.value;
                  this._config.board.map[row][y].value.changePosition([row - 1, y]);
                  this._config.board.map[row][y].value = null;
                  row--;
                } else if (this._config.board.map[row - 1][y].value.value === this._config.board.map[row][y]?.value?.value) {
                  this._config.board.map[row - 1][y].value.value *= 2;
                  this.score += this._config.board.map[row - 1][y]?.value?.value;
                  this._config.board.map[row][y].value = null;
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        this.moveCounter++;
        this.nativeStopper = true;
      },
      right: () => {
        for (let x = 0; x < this._config.game.size; x++) {
          for (let y = this._config.game.size - 2; y >= 0; y--) {
            let column = y;
            if (this._config.board.map[x][y]?.value) {
              while (column + 1 < this._config.game.size) {
                if (!this._config.board.map[x][column + 1]?.value) {
                  this._config.board.map[x][column + 1].value = this._config.board.map[x][column]?.value;
                  this._config.board.map[x][column]?.value.changePosition([x, column + 1]);
                  this._config.board.map[x][column].value = null;
                  column++;
                } else if (this._config.board.map[x][column + 1].value.value === this._config.board.map[x][column].value.value) {
                  this._config.board.map[x][column + 1].value.value = this._config.board.map[x][column + 1].value.value * 2;
                  this.score += this._config.board.map[x][column + 1].value.value;
                  this._config.board.map[x][column].value = null;
                  this.create()
                    .tile();
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        this.moveCounter++;
        this.nativeStopper = true;
      },
      down: () => {
        for (let y = 0; y < this._config.game.size; y++) {
          for (let x = this._config.game.size - 2; x >= 0; x--) {
            let row = x;
            if (this._config.board.map[x][y]?.value) {
              while (row + 1 < this._config.game.size) {
                if (!this._config.board.map[row + 1][y]?.value) {
                  this._config.board.map[row][y]?.value.changePosition([row + 1, y]);
                  this._config.board.map[row + 1][y].value = this._config.board.map[row][y].value;
                  this._config.board.map[row][y].value = null;
                  row++;
                } else if (this._config.board.map[row + 1][y].value.value === this._config.board.map[row][y].value.value) {
                  this._config.board.map[row + 1][y].value.value *= 2;
                  this.score += this._config.board.map[row + 1][y].value.value;
                  this._config.board.map[row][y].value = null;
                  this.create()
                    .tile();
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        this.moveCounter++;
        this.nativeStopper = true;
      },
      left: () => {
        for (let x = 0; x < this._config.game.size; x++) {
          for (let y = 1; y < this._config.game.size; y++) {
            let column = y;
            if (this._config.board.map[x][y].value) {
              while (column > 0) {
                if (!this._config.board.map[x][column - 1].value) {
                  this._config.board.map[x][column - 1].value = this._config.board.map[x][column].value;
                  this._config.board.map[x][column].value.changePosition([x, column - 1]);
                  this._config.board.map[x][column].value = null;
                  column--;
                } else if (this._config.board.map[x][column - 1].value.value === this._config.board.map[x][column].value.value) {
                  this._config.board.map[x][column - 1].value.value = this._config.board.map[x][column - 1].value.value * 2;
                  this.score += this._config.board.map[x][column - 1].value.value;
                  this._config.board.map[x][column].value = null;
                  this.create()
                    .tile();
                  break;
                } else {
                  break;
                }
              }
            }
          }
        }

        this.moveCounter++;
        this.nativeStopper = true;
      },
    };
  }

  protected _iterateMatrix(matrix: TMap[][]): TMap[] {
    const array: TMap[] = [];

    let cloneMatrix = [];

    for (let m = 0; m < matrix.length; m++) {
      cloneMatrix.push([...matrix[m]]);
    }

    while (cloneMatrix.length) {
      array.push(
        ...cloneMatrix.shift(),
        ...cloneMatrix.map(a => a.pop()),
        ...(cloneMatrix.pop() || []).reverse(),
        ...cloneMatrix.map(a => a.shift())
          .reverse(),
      );
    }
    return array;
  }

  private startFirstRound() {
    this.findFreeCells();
    this.create()
      .tile();
    this.create()
      .tile();
    this.draw()
      .board();
    this.draw()
      .cell();
    this.draw()
      .tile();
  }

  private update() {
    // TODO: добавить проверку на совершенное действие, чтобы пофиксить баг с появлением тайла.
    const hasChanges = false;
    console.log(hasChanges);
    // if (hasChanges) {
      this.create()
        .tile();
    // }
    this._cache = this._iterateMatrix(this._config.board.map);
    this.cleanGame();
    this.draw()
      .board();
    this.draw()
      .cell();
    this.draw()
      .tile();
    this.nativeStopper = false;
    console.log(this.score);
    console.log(this.moveCounter);
    console.log(this.gameStatus);
  }

  private cleanGame() {
    this._ctx.clearRect(0, 0, this._config.board.size, this._config.board.size);
  }
}
