import { Config } from '../../../types/config';

export interface ITile {
  x: number;
  y: number;
  readonly ctx: CanvasRenderingContext2D;
  value: number;
  color: string;
  readonly strokeColor: string;
  readonly size: number;
  fontSize: number;
  font: string;
  shadow: string;
  fontColor: string | CanvasGradient | CanvasPattern;
  coordinates: number[];
  config: Config;
}

export type TileConstructor = {
  ctx: CanvasRenderingContext2D;
  coordinates: number[];
  value: number;
  config: Config;
}
