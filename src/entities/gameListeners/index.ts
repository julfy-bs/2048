import { GameConstructor } from '../../shared/types/gameConstructor';
import { GameStatus } from '../../shared/utils/constants';
import { GameBase } from '../gameBase';
import { IGameListeners } from './model';

export class GameListeners extends GameBase implements IGameListeners {
  constructor({
    canvas,
    ctx,
    config,
    engine,
  }: GameConstructor) {
    super({ canvas, ctx, config, engine });
  }

  public addEventListeners(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => this._handleKeyboardEvents(e));
    this._canvas.addEventListener('click', (event: MouseEvent) => {
      const rect: DOMRect = this._canvas.getBoundingClientRect();
      const x: number = event.clientX - rect.left;
      const y: number = event.clientY - rect.top;
      const distance: boolean = this._restartButton.clickButton(x, y);
      if (distance) {
        this._gameStatus = GameStatus.NEW;
        this._restartGame();
      }
    });
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

  private _handleKeyboardEvents = (e: KeyboardEvent): void => {
    if (this._gameStatus !== GameStatus.OVER) {
      const { up, down, left, right } = this._controller();
      if (e.key === 'ArrowUp') {
        if (!this._nativeStopper) {
          up();
        }
        this._update();
      }
      if (e.key === 'ArrowRight') {
        if (!this._nativeStopper) {
          right();
        }
        this._update();
      }
      if (e.key === 'ArrowDown') {
        if (!this._nativeStopper) {
          down();
        }
        this._update();
      }
      if (e.key === 'ArrowLeft') {
        if (!this._nativeStopper) {
          left();
        }
        this._update();
      }
    }
  };

  private _handleMouseDownEvent(e: MouseEvent): void {
    if (this._gameStatus !== GameStatus.OVER) {
      this._oldY = e.pageY;
      this._oldX = e.pageX;
    }
  }

  private _handleDirection(deltaX: number, deltaY: number): void {
    if (this._gameStatus !== GameStatus.OVER) {
      const { up, down, left, right } = this._controller();

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          if (!this._nativeStopper) {
            left();
          }
          this._update();
        } else if (deltaX < 0) {
          if (!this._nativeStopper) {
            right();
          }
          this._update();
        }
      } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
        if (deltaY > 0) {
          if (!this._nativeStopper) {
            up();
          }
          this._update();
        } else if (deltaY < 0) {
          if (!this._nativeStopper) {
            down();
          }
          this._update();
        }
      } else {
        return;
      }
    }
  }

  private _handleMouseUpEvent(e: MouseEvent): void {
    if (this._gameStatus !== GameStatus.OVER) {
      let deltaX: number = this._oldX - e.pageX;
      let deltaY: number = this._oldY - e.pageY;
      this._handleDirection(deltaX, deltaY);
    }
  }

  private _handleTouchStartEvent(e: TouchEvent): void {
    if (this._gameStatus !== GameStatus.OVER) {
      this._oldX = Math.floor(e.changedTouches[0].pageX);
      this._oldY = Math.floor(e.changedTouches[0].pageY);
    }
  }

  private _handleTouchEndEvent(e: TouchEvent): void {
    if (this._gameStatus !== GameStatus.OVER) {
      let deltaX: number = this._oldX - Math.floor(e.changedTouches[0].pageX);
      let deltaY: number = this._oldY - Math.floor(e.changedTouches[0].pageY);
      this._handleDirection(deltaX, deltaY);
    }
  }

  private _controller() {
    let isPositionChanged = false;
    return {
      up: () => {
        for (let y: number = 0; y < this._config.game.size; y++) {
          for (let x: number = 1; x < this._config.game.size; x++) {
            if (this._config.board.map[x][y]?.value) {
              let row: number = x;
              while (row > 0) {
                if (!this._config.board.map[row - 1][y].value) {

                  this._config.board.map[row - 1][y].value = this._config.board.map[row][y].value;
                  this._config.board.map[row][y].value = null;
                  isPositionChanged = true;
                  row--;
                } else if (this._config.board.map[row - 1][y].value === this._config.board.map[row][y].value) {
                  this._config.board.map[row - 1][y].value *= 2;
                  this._score += this._config.board.map[row - 1][y].value;
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
          this._moveCounter++;
          this._nativeStopper = true;
          this._create()
            .tile();
        }
      },
      right: () => {
        for (let x: number = 0; x < this._config.game.size; x++) {
          for (let y: number = this._config.game.size - 2; y >= 0; y--) {
            let column: number = y;
            if (this._config.board.map[x][y]?.value) {
              while (column + 1 < this._config.game.size) {
                if (!this._config.board.map[x][column + 1]?.value) {
                  this._config.board.map[x][column + 1].value = this._config.board.map[x][column].value;
                  this._config.board.map[x][column].value = null;
                  isPositionChanged = true;
                  column++;
                } else if (this._config.board.map[x][column + 1].value === this._config.board.map[x][column].value) {
                  this._config.board.map[x][column + 1].value *= 2;
                  this._score += this._config.board.map[x][column + 1].value;
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
          this._moveCounter++;
          this._nativeStopper = true;
          this._create()
            .tile();
        }
      },
      down: () => {
        for (let y: number = 0; y < this._config.game.size; y++) {
          for (let x: number = this._config.game.size - 2; x >= 0; x--) {
            let row: number = x;
            if (this._config.board.map[x][y].value) {
              while (row + 1 < this._config.game.size) {
                if (!this._config.board.map[row + 1][y].value) {
                  this._config.board.map[row + 1][y].value = this._config.board.map[row][y].value;
                  this._config.board.map[row][y].value = null;
                  isPositionChanged = true;
                  row++;
                } else if (this._config.board.map[row + 1][y].value === this._config.board.map[row][y].value) {
                  this._config.board.map[row + 1][y].value *= 2;
                  this._score += this._config.board.map[row + 1][y].value;
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
          this._moveCounter++;
          this._nativeStopper = true;
          this._create()
            .tile();
        }
      },
      left: () => {
        for (let x: number = 0; x < this._config.game.size; x++) {
          for (let y: number = 1; y < this._config.game.size; y++) {
            let column: number = y;
            if (this._config.board.map[x][y].value) {
              while (column > 0) {
                if (!this._config.board.map[x][column - 1].value) {
                  this._config.board.map[x][column - 1].value = this._config.board.map[x][column].value;
                  this._config.board.map[x][column].value = null;
                  isPositionChanged = true;
                  column--;
                } else if (this._config.board.map[x][column - 1].value === this._config.board.map[x][column].value) {
                  this._config.board.map[x][column - 1].value *= 2;
                  this._score += this._config.board.map[x][column - 1].value;
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
          this._moveCounter++;
          this._nativeStopper = true;
          this._create()
            .tile();
        }
      },
    };
  }
}
