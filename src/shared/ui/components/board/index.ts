import { Config } from '../../../../app';

export class Board {
  private readonly ctx: CanvasRenderingContext2D;
  private map: any;
  private color: string;
  private readonly size: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    config: Config
    ) {
    this.ctx = ctx;
    this.map = config.board.map;
    this.color = config.board.color;
    this.size = config.board.size;
  }

  addBoard(drawCells: () => void): void {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.roundRect(0, 0, this.size, this.size, [10]);
    this.ctx.fill();
    drawCells();
  }
}
