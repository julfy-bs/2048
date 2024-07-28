import '../../index.css';
import { Game } from '../features/game';
import { Board } from '../shared/ui/components/board';
import { Cell } from '../shared/ui/components/cell';
import { Tile, TileConstructor } from '../shared/ui/components/tile';

const canvas: HTMLCanvasElement = document.querySelector('#canvas');

export type TPosition = {
  x: number;
  y: number;
}

export type TMap = {
  x: number;
  y: number;
  value: Tile | null;
}

export type XCoordinate = number;
export type YCoordinate = number;
export type Coordinates = [XCoordinate, YCoordinate]

const cellSize = 128;
const boardSize = 572;
const fontSize = 40;
const fontColor = '#776e65';
const padding = 12;
const font = `Clear Sans, 'Helvetica Neue', 'Arial', sans-serif`;

export const getRandomCoords = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const coordinates: number[][] = [
  [0, 0], [1, 0], [2, 0], [3, 0],
  [0, 1], [1, 1], [2, 1], [3, 1],
  [0, 2], [1, 2], [2, 2], [3, 2],
  [0, 3], [1, 3], [2, 3], [3, 3],
];

const map: Map<number[], TMap> = new Map();
map
  .set(coordinates[0], { x: padding, y: padding, value: null })
  .set(coordinates[1], { x: padding * 2 + cellSize, y: padding, value: null })
  .set(coordinates[2], { x: padding * 3 + cellSize * 2, y: padding, value: null })
  .set(coordinates[3], { x: padding * 4 + cellSize * 3, y: padding, value: null })
  .set(coordinates[4], { x: padding, y: padding * 2 + cellSize, value: null })
  .set(coordinates[5], { x: padding * 2 + cellSize, y: padding * 2 + cellSize, value: null })
  .set(coordinates[6], { x: padding * 3 + cellSize * 2, y: padding * 2 + cellSize, value: null })
  .set(coordinates[7], { x: padding * 4 + cellSize * 3, y: padding * 2 + cellSize, value: null })
  .set(coordinates[8], { x: padding, y: padding * 3 + cellSize * 2, value: null })
  .set(coordinates[9], { x: padding * 2 + cellSize, y: padding * 3 + cellSize * 2, value: null })
  .set(
    coordinates[10],
    { x: padding * 3 + cellSize * 2, y: padding * 3 + cellSize * 2, value: null },
  )
  .set(
    coordinates[11],
    { x: padding * 4 + cellSize * 3, y: padding * 3 + cellSize * 2, value: null },
  )
  .set(coordinates[12], { x: padding, y: padding * 4 + cellSize * 3, value: null })
  .set(coordinates[13], { x: padding * 2 + cellSize, y: padding * 4 + cellSize * 3, value: null })
  .set(
    coordinates[14],
    { x: padding * 3 + cellSize * 2, y: padding * 4 + cellSize * 3, value: null },
  )
  .set(
    coordinates[15],
    { x: padding * 4 + cellSize * 3, y: padding * 4 + cellSize * 3, value: null },
  );

export type TBoard = {
  index: number;
  size: number;
  color: string;
  strokeColor: string;
  padding: number;
  font: string;
  fontSize: number;
  fontColor: string;
  map: Map<number[], TMap>;
}

export type TCell = {
  size: number;
}

export type Config = {
  board: TBoard;
  cell: TCell;
}

const gameConfig: Config = {
  board: {
    index: 4,
    size: 4 * cellSize + padding * 5,
    color: '#bbada0',
    strokeColor: '#000',
    padding: padding,
    font: font,
    fontSize: fontSize,
    fontColor: fontColor,
    map: map,
  },
  cell: {
    size: cellSize,
  },
};

const createTile = ({ ctx, coordinates, value, config }: TileConstructor) => {
  return new Tile(
    { ctx, coordinates, value, config },
  );
};

const ctx = canvas.getContext('2d');
canvas.width = boardSize;
canvas.height = boardSize;
const board = new Board(ctx, gameConfig);
const game = new Game(ctx, gameConfig, board, coordinates);
game.start(() => createTile);

// // перенести в класс game
// const objects: Tile[] = [
//   new Tile({
//     ctx,
//     coordinates: coordinates[getRandomCoords(0, coordinates.length)],
//     value: getRandomCoords(0, 100) > 90 ? 4 : 2,
//     config: gameConfig,
//   }),
//   new Tile({
//     ctx,
//     coordinates: coordinates[getRandomCoords(0, coordinates.length)],
//     value: getRandomCoords(0, 100) > 90 ? 4 : 2,
//     config: gameConfig,
//   }),
// ];
//
// objects.forEach(objectToDraw => {
//   game.createTile(objectToDraw);
// });
// const tile2 = new Tile(ctx, 2, {x: cellSize, y: cellSize * 3}, '#000', cellSize,
// font, fontSize, '#776e65') tile.addTile(); tile.assignValue(); tile2.addTile();
// tile2.assignValue();

