import { Config } from '../../../types/config';
import { colors as gameColors } from '../../../utils/constants/colors';
import { Cell } from '../cell';
import { ITile, TileConstructor } from './types';

export class Tile extends Cell implements ITile {
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

  constructor({
    ctx,
    coordinates,
    value,
    config,
  }: TileConstructor) {
    super({
      ctx,
      size: config.cell.size,
      config,
      coordinates,
    });
    this.config = config;
    this.value = value;
    this.strokeColor = config.board.strokeColor;
    this.ctx = ctx;
    this.size = config.cell.size;
    this.font = config.board.font;
    this.fontSize = config.board.fontSize;
    this.fontColor = config.board.fontColor;
    this.coordinates = coordinates;
    this.x = this.config.board.map[this.coordinates[1]][this.coordinates[0]].x;
    this.y = this.config.board.map[this.coordinates[1]][this.coordinates[0]].y;
  }

  protected _assignColor(): void {
    const colors = Object.entries(gameColors);
    let i = 0;
    while (i < colors.length) {
      if (+colors[i][0] === this.value) {
        this.color = colors[i][1];
      }
      if (this.value < 8) {
        this.fontColor = '#776e65';
      } else {
        this.fontColor = '#f9f6f2';
      }
      i++;
    }
  }

  protected _assignValue(): void {
    this.ctx.font = `bold ${ this.fontSize }px ${ this.font }`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.fontColor;
    this.ctx.fillText(
      this.value.toString(),
      this.x + this.size / 2,
      this.y + this.size / 2 + this.fontSize / 2.5,
    );
  };

  public draw(): void {
    if(this.value !== null) {
      this._assignColor();
      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      this.ctx.roundRect(this.x, this.y, this.size, this.size, [2]);
      this.ctx.fill();
      this._assignValue();
    }
  };
}
