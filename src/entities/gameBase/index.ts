import { GameConstructor } from '../../shared/types/gameConstructor';
import { CreateMethod, DrawMethod, PossibleGameStatuses } from './types';
import { Config } from '../../shared/types/config';
import { GameConstruct } from '../../shared/types/gameConstruct';
import { TMap } from '../../shared/types/map';
import { Board } from '../../shared/ui/components/board';
import { Button } from '../../shared/ui/components/button';
import { Cell } from '../../shared/ui/components/cell';
import { Score } from '../../shared/ui/components/score';
import { Tile } from '../../shared/ui/components/tile';
import { GameStatus } from '../../shared/utils/constants';
import { checkLose } from '../../shared/utils/helpers/checkLose';
import { checkWin } from '../../shared/utils/helpers/checkWin';
import { createCells } from '../../shared/utils/helpers/createCells';
import { findFreeCells } from '../../shared/utils/helpers/findFreeCells';
import { getRandomNumber } from '../../shared/utils/helpers/getRandomNumbers';

export class GameBase {
  protected readonly _ctx: CanvasRenderingContext2D;
  protected readonly _engine: GameConstruct;
  protected readonly _cache: TMap[][] | null;
  protected _config: Config;
  protected _gameStatus: PossibleGameStatuses;
  protected _moveCounter: number;
  protected _nativeStopper: boolean;
  protected _oldX: number;
  protected _oldY: number;
  protected _restartButton: Button;
  protected _canvas: HTMLCanvasElement;
  protected _score: number;
  protected _isCreatingTilesAvailable: boolean;
  protected _gameCached: boolean;
  protected _bestScore: number;

  constructor({
    canvas,
    ctx,
    config,
    engine,
  }: GameConstructor) {
    this._ctx = ctx;
    this._config = config;
    this._moveCounter = 0;
    this._nativeStopper = false;
    this._config = config;
    this._score = JSON.parse(localStorage.getItem('score')) ?? 0;
    this._bestScore = JSON.parse(localStorage.getItem('bestScore')) ?? 0;
    this._engine = engine;
    this._oldX = 0;
    this._oldY = 0;
    this._cache = JSON.parse(localStorage.getItem('cache')) ?? null;
    this._canvas = canvas;
  }

  protected _create(): CreateMethod {
    const {
      cell: createCell,
      tile: createTile,
      board: createBoard,
      score: createScore,
      button: createButton,
    } = this._engine;

    return {
      board: (): Board => createBoard({ ctx: this._ctx, config: this._config }),
      cell: (): Cell[] => createCells({
        ctx: this._ctx,
        config: this._config,
        cell: createCell,
      }),
      tile: (): Tile => {
        let newTile: Tile;
        let isTileCreated = false;
        while (!isTileCreated && this._isCreatingTilesAvailable) {
          newTile = createTile({
            ctx: this._ctx,
            coordinates: [
              getRandomNumber(0, this._config.game.size),
              getRandomNumber(0, this._config.game.size),
            ],
            value: getRandomNumber(0, 100) > 90 ? 4 : 2,
            config: this._config,
          });
          const isCellAvailable: boolean = this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]].value === null;
          if (isCellAvailable
            && !this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]]?.value
          ) {
            this._config.board.map[newTile.coordinates[0]][newTile.coordinates[1]].value = newTile.value;
            isTileCreated = true;
            const isGameWon = checkWin(this._config.board.map);
            if (isGameWon) {
              this._gameStatus = GameStatus.WIN;
            }
            this._checkLose();
            this._findFreeCells();
          } else if (!isCellAvailable && !this._isCreatingTilesAvailable) {
            this._checkLose();
            this._endGame();
          }
        }

        return newTile;
      },
      score: (): Score => createScore({
        ctx: this._ctx,
        config: this._config,
        position: this._config.score.score.position,
        value: this._score,
        title: 'Score',
      }),
      bestScore: (): Score => createScore({
        ctx: this._ctx,
        config: this._config,
        position: this._config.score.bestScore.position,
        value: this._bestScore,
        title: 'Best score',
      }),
      button: (): Button => {
        const button: Button = createButton({
          ctx: this._ctx,
          config: this._config,
          position: this._config.button.position,
          title: this._config.button.title,
        });
        this._restartButton = button;
        return button;
      },
    };
  }

  protected _update(): void {
    localStorage.setItem('cache', JSON.stringify(this._config.board.map));
    localStorage.setItem('score', JSON.stringify(this._score));
    localStorage.setItem('bestScore', JSON.stringify(this._bestScore));
    this._cleanGame();
    this._checkScore();
    const isGameWon: boolean = checkWin(this._config.board.map);
    if (isGameWon) {
      this._gameStatus = GameStatus.WIN;
    }
    this._findFreeCells();
    this._checkLose();
    this._draw()
      .all();

    if (this._gameStatus === GameStatus.OVER) {
      this._endGame();
      return;
    }

    if (this._gameStatus === GameStatus.WIN) {
      this._winGame();
    }
    this._nativeStopper = false;
    this._gameStatus = GameStatus.CONTINUES;
  }

  protected _restartGame(): void {
    if (this._gameStatus === GameStatus.NEW) {
      for (let x: number = 0; x < this._config.board.map.length; x++) {
        for (let y: number = 0; y < this._config.board.map.length; y++) {
          this._config.board.map[x][y].value = null;
        }
      }
      this._cleanGame();
      this._startFirstRound();
    }
  }

  protected _cleanGame(): void {
    this._ctx.clearRect(0, 0, this._config.board.size, this._config.board.size);
  }

  protected _startFirstRound(): void {
    if (this._gameCached && this._gameStatus === GameStatus.CONTINUES) {
      this._downloadGameData();
      this._checkLose();
      this._findFreeCells();
      const isGameWon: boolean = checkWin(this._config.board.map);
      if (isGameWon) {
        this._gameStatus = GameStatus.WIN;
      }
      this._checkLose();
    }
    if (this._gameStatus === GameStatus.NEW) {
      this._findFreeCells();
      this._score = 0;
      this._create()
        .tile();
      this._create()
        .tile();
    }
    this._draw()
      .all();
    if (this._gameStatus === GameStatus.OVER) {
      this._endGame();
    }

    if (this._gameStatus === GameStatus.WIN) {
      this._winGame();
    }
  }

  private _checkLose(): void {
    const isGameLoss: boolean =
      checkLose({
        matrix: this._config.board.map,
        isCreatingTilesAvailable: this._isCreatingTilesAvailable,
      });
    isGameLoss && (this._gameStatus = GameStatus.OVER);
  }

  private _downloadGameData(): void {
    this._checkScore();
    for (let x: number = 0; x < this._config.board.map.length; x++) {
      for (let y: number = 0; y < this._config.board.map.length; y++) {
        this._config.board.map[x][y].value = this._cache[x][y].value;
      }
    }
    this._draw()
      .tiles();
  }

  private _findFreeCells(): void {
    const {
      isCreatingTilesAvailable,
    } = findFreeCells(this._config.board.map);
    this._isCreatingTilesAvailable = isCreatingTilesAvailable;
  }

  private _draw(): DrawMethod {
    const {
      board: createBoard,
      cell: createCell,
      score: createScore,
      bestScore: createBestScore,
      button: createButton,
    } = this._create();
    const { tile: createTile } = this._engine;
    return {
      board: (): void => {
        createBoard()
          .draw();
      },
      cell: (): void => {
        const cells: Cell[] = createCell();
        cells.forEach((cell: Cell) => cell.draw());
      },
      tiles: (): void => {
        for (let y: number = 0; y < this._config.board.map.length; y++) {
          for (let x: number = 0; x < this._config.board.map.length; x++) {
            if (this._config.board.map[y][x].value !== null) {
              const newTile: Tile = createTile({
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
      button: (): void => {
        createButton()
          .draw();
      },
      all: (): void => {
        this._draw()
          .score();
        this._draw()
          .bestScore();
        this._draw()
          .button();
        this._draw()
          .board();
        this._draw()
          .cell();
        this._draw()
          .tiles();
      },
    };
  }

  private _checkScore(): void {
    if (this._score > this._bestScore) {
      this._bestScore = this._score;
    }
  }

  private _endGame(): void {
    if (this._gameStatus === GameStatus.OVER) {
      const {
        board: createBoard,
      } = this._engine;
      const board: Board = createBoard({
        ctx: this._ctx,
        config: this._config,
      });
      board.alert('Game over =(');
      board.draw();
    }
  }

  private _winGame(): void {
    if (this._gameStatus === GameStatus.WIN) {
      const {
        board: createBoard,
      } = this._engine;
      const board: Board = createBoard({
        ctx: this._ctx,
        config: this._config,
      });
      board.alert('Well played, you win!');
      board.draw();
    }
  }
}
