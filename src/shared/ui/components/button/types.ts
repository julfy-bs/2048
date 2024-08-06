import { Config } from '../../../types/config';
import { Coordinates } from '../../../types/coordinates';

export type ButtonConstructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
  position: Coordinates;
  title: string;
}
