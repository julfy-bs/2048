import { Config } from '../../../../app';

export type CellConstructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
  size: number;
  coordinates: number[];
}

export class Cell {
  readonly ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  size: number;
  coordinates: number[];
  protected config: Config;

  constructor({
    ctx,
    size,
    coordinates,
    config
  }: CellConstructor) {
    this.ctx = ctx;
    this.size = size;
    this.config = config;
    this.color = 'rgba(238, 228, 218, 0.35)';
    this.coordinates = coordinates;
    this.x = this.config.board.map[this.coordinates[0]][this.coordinates[1]].x!;
    this.y = this.config.board.map[this.coordinates[0]][this.coordinates[1]].y!;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.roundRect(this.x, this.y, this.size, this.size, [2]);
    this.ctx.fill();
  }
}
