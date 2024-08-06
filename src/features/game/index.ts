import { GameListeners } from '../../entities/gameListeners';
import { GameConstructor } from '../../shared/types/gameConstructor';
import { GameStatus } from '../../shared/utils/constants';
import { IGame } from './model';

export class Game extends GameListeners implements IGame {
  constructor({
    canvas,
    ctx,
    config,
    engine,
  }: GameConstructor) {
    super({ canvas, ctx, config, engine });
  }

  public start(): void {
    if (this._cache !== null && this._score !== 0) {
      this._gameCached = true;
      this._gameStatus = GameStatus.CONTINUES;
    } else {
      this._gameStatus = GameStatus.NEW;
    }
    this._startFirstRound();
    this.addEventListeners();
  }
}
