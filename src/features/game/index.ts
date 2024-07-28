import { Config, Coordinates, getRandomCoords, TMap, TPosition } from '../../app';
import { Board } from '../../shared/ui/components/board';
import { Cell } from '../../shared/ui/components/cell';
import { Tile, TileConstructor } from '../../shared/ui/components/tile';

/**
 * @class Game
 * @description Создает объект игры.
 */
export class Game {
  private readonly ctx: CanvasRenderingContext2D;
  private config: Config;
  private board: Board;
  private objects: Tile[];
  private freeCells: Coordinates[];
  private coordinates: number[][];

  constructor(
    ctx: CanvasRenderingContext2D,
    config: Config,
    board: Board,
    coordinates: number[][],
  ) {
    this.ctx = ctx;
    this.board = board;
    this.config = config;
    this.objects = [];
    this.freeCells = [];
    this.coordinates = coordinates;
  }

  start(createTile: ({}: TileConstructor) => void) {
    this.board.addBoard(() => {
      const iterator = this.config.board.map.entries();
      for (let i = 0; i < this.config.board.map.size; i++) {
        const [key, value] = iterator.next().value;
        const cell = new Cell({
          ctx: this.ctx,
          size: this.config.cell.size,
          config: this.config,
          coordinates: key,
        });
        cell.addCell();
      }
    });
    createTile({
      ctx: this.ctx,
    // @ts-ignore
      coordinates: this.coordinates[getRandomCoords(0, this.coordinates.length)],
      value: getRandomCoords(0, 100) > 90 ? 4 : 2,
      config: this.config,
    });
    this.objects.forEach(objectToDraw => {
      this.createTile(objectToDraw);
    });
  }

  createTile(tile: Tile): void {
    const iterator = this.config.board.map.entries();
    let i = 0;
    const [x, y] = tile.coordinates;

    while (i < this.config.board.map.size) {
      const [[mapX, mapY], value]: [Coordinates, TMap] = iterator.next().value;

      if (
        x === mapX
        && y === mapY
      ) {

        this.config.board.map.set(tile.coordinates, {
          ...value,
          value: tile,
        });
        tile.addTile();
        tile.assignValue();
        this.objects.push(tile);
      }
      i++;
    }
    this.findFreeCells();
    console.log(this.freeCells);
    console.log(this.objects);
  }

  findFreeCells() {
    const iterator = this.config.board.map.entries();
    let i = 0;

    while (i < this.config.board.map.size) {
      const [key, value]: [Coordinates, TMap] = iterator.next().value;

      if (value.value === null) {
        this.freeCells.push(key);
      }
      i++;
    }
  }
}
