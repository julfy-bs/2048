import { Config } from '../../../../app';

export type BoardConstructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
}

export class Board {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly color: string;
  private readonly size: number;
  private config: Config;

  constructor({
    ctx,
    config,
  }: BoardConstructor) {
    this.ctx = ctx;
    this.color = config.board.color;
    this.size = config.board.size;
    this.config = config;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.roundRect(0, this.config.canvas.headerHeight, this.size, this.size, [10]);
    this.ctx.fill();
  }
}
