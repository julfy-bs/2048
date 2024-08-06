import { Config } from '../../../types/config';
import { Coordinates } from '../../../types/coordinates';
import { ButtonConstructor } from './types';

export class Button {
  readonly ctx: CanvasRenderingContext2D;
  private readonly color: string;
  private config: Config;
  private readonly position: Coordinates;
  private readonly font: string;
  private readonly fontSize: number;
  private readonly fontColor: string;
  x: number;
  y: number;
  private readonly width: number;
  private readonly height: number;
  private title: string;

  constructor({
    ctx,
    config,
    position,
    title
  }: ButtonConstructor) {
    this.ctx = ctx;
    this.color = config.button.color;
    this.position = position;
    this.config = config;
    this.fontSize = config.score.fontSize;
    this.fontColor = config.score.fontColor;
    this.font = config.score.font;
    this.x = this.position[0];
    this.y = this.position[1];
    this.width = config.button.width;
    this.height = config.button.height;
    this.title = title;
  }

  protected _assignValue(): void {
    this.ctx.font = `bold ${ this.fontSize }px ${ this.font }`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.fontColor;
    this.ctx.fillText(
      this.title.toString(),
      this.x + this.width / 2,
      this.y + this.height / 2 + this.fontSize / 2.5,
    );
  };

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.roundRect(this.x, this.y, this.width, this.height, [10]);
    this.ctx.fill();
    this._assignValue();
  }

  clickButton(x: number, y: number): boolean {
    const distance = {
      width: this.x + this.width,
      height: this.y + this.height
    }
    return distance.width > x && this.x < x && distance.height > y && this.y < y;
  }
}
