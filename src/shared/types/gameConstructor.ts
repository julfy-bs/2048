import { Config } from './config';
import { GameConstruct } from './gameConstruct';

export type GameConstructor = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: Config;
  engine: GameConstruct;
}
