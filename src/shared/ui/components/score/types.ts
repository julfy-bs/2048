import { Config } from '../../../types/config';
import { Coordinates } from '../../../types/coordinates';

export type ScoreConstructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
  position: Coordinates;
  value: number;
  title: string;
}
