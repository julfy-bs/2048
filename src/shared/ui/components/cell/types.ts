import { Config } from '../../../types/config';

export type CellConstructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
  size: number;
  coordinates: number[];
}
