import { Config } from '../../../types/config';
import { BoardConstructor } from './types';



export class Board {
  private readonly ctx: CanvasRenderingContext2D;
  private color: string;
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

  protected _assignValue(value: string): void {
    this.ctx.font = `bold ${ this.config.board.fontSize }px ${ this.config.board.font }`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      value,
      this.size / 2,
      this.config.canvas.headerHeight + this.config.canvas.contentHeight / 2 + this.config.board.fontSize * .33,
    );
  };

  alert(value: string) {
    this.color = 'rgba(0,0,0, .55)';
    this.draw();
    this._assignValue(value);
  }
}
