import { Coordinates } from '../../../types/coordinates';
import { ScoreConstructor } from './types';

export class Score {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly color: string;
  private readonly position: Coordinates;
  private readonly font: string;
  private readonly fontSize: number;
  private readonly fontColor: string;
  private readonly x: number;
  private readonly y: number;
  private readonly width: number;
  private readonly height: number;
  private value: number;
  private title: string;

  constructor({
    ctx,
    config,
    position,
    value,
    title
  }: ScoreConstructor) {
    this.ctx = ctx;
    this.color = config.score.color;
    this.position = position;
    this.font = config.score.font;
    this.fontSize = config.score.fontSize;
    this.fontColor = config.score.fontColor;
    this.x = this.position[0];
    this.y = this.position[1];
    this.width = config.score.width;
    this.height = config.score.height;
    this.value = value;
    this.title = title;
  }

  protected _assignValue(): void {
    this.ctx.font = `bold ${ this.fontSize }px ${ this.font }`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.fontColor;
    this.ctx.fillText(
      this.value.toString(),
      this.x + this.width / 2,
      this.y + this.fontSize + 6 + this.height / 2 + this.fontSize / 2.5,
    );
    this.ctx.fillStyle = this.color;
    this.ctx.font = `bold ${ this.fontSize * .75 }px ${ this.font }`;
    this.ctx.fillText(
      this.title.toString(),
      this.x + this.width / 2,
      this.y + this.fontSize,
    );
  };

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.roundRect(this.x, this.y + this.fontSize + 6, this.width, this.height, [10]);
    this.ctx.fill();
    this._assignValue();
  }
}
