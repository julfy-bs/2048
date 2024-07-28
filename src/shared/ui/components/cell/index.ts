import { Config } from '../../../../app';

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
  }: any) {
    this.ctx = ctx;
    this.size = size;
    this.config = config;
    this.color = 'rgba(238, 228, 218, 0.35)';
    this.coordinates = coordinates;
    this.x = this.config.board?.map?.get(coordinates)?.x;
    this.y = this.config.board?.map?.get(coordinates)?.y;
  }

  addCell() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.roundRect(this.x, this.y, this.size, this.size, [2]);
    this.ctx.fill();
    this.insertTile();
  }

  insertTile() {
    // console.log(this.coordinates, this.x, this.y);
  }
}
