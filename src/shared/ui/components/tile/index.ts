import { Config, Coordinates } from '../../../../app';
import { colorsMap } from '../../../utils/constants/colors';
import { Cell } from '../cell';

interface ITile {
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
    this.x = config.board?.map?.get(coordinates)?.x;
    this.y = config.board?.map?.get(coordinates)?.y;
  }

  _assignColor() {
    const colors = Object.entries(colorsMap);
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

  assignValue = () => {
    this.ctx.font = `bold ${ this.fontSize }px ${ this.font }`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.fontColor;
    // console.log(this.x, this.y);
    this.ctx.fillText(
      this.value.toString(),
      this.x + this.size / 2,
      this.y + this.size / 2 + this.fontSize / 2.5,
    );
  };

  addTile = (): void => {
    this._assignColor();
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.roundRect(this.x, this.y, this.size, this.size, [2]);
    this.ctx.fill();
  };
}
