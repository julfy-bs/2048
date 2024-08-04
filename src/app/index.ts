import '../../index.css';
import { nanoid } from 'nanoid';
import { Game } from '../features/game';
import { Board, BoardConstructor } from '../shared/ui/components/board';
import { Cell, CellConstructor } from '../shared/ui/components/cell';
import { Tile, TileConstructor } from '../shared/ui/components/tile';

const canvas: HTMLCanvasElement = document.querySelector('#canvas');

export type TPosition = {
  x: number;
  y: number;
}

export type TMap = {
  id: string;
  x: number;
  y: number;
  value: number | null;
  coordinates: Coordinates;
}

export type XCoordinate = number;
export type YCoordinate = number;
export type Coordinates = [XCoordinate, YCoordinate]

const cellSize = 128;
const boardSize = 572;
// const boardSize = window.innerWidth - 20 ?? 572;
// const boardHeight = (window.innerWidth - 20 + (window.innerWidth - 20) / 100 * 33) ?? 572;
const fontSize = 40;
const fontColor = '#776e65';
const padding = 12;
const font = `Clear Sans, 'Helvetica Neue', 'Arial', sans-serif`;
const gameSize = 4;

export const getRandomCoords = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const map: TMap[][] = [
  [
    { id: nanoid(), x: padding, y: padding, value: null, coordinates: [0, 0] },
    { id: nanoid(), x: padding * 2 + cellSize, y: padding, value: null, coordinates: [1, 0] },
    { id: nanoid(), x: padding * 3 + cellSize * 2, y: padding, value: null, coordinates: [2, 0] },
    { id: nanoid(), x: padding * 4 + cellSize * 3, y: padding, value: null, coordinates: [3, 0] },
  ],
  [
    { id: nanoid(), x: padding, y: padding * 2 + cellSize, value: null, coordinates: [0, 1] },
    { id: nanoid(), x: padding * 2 + cellSize, y: padding * 2 + cellSize, value: null, coordinates: [1, 1] },
    { id: nanoid(), x: padding * 3 + cellSize * 2, y: padding * 2 + cellSize, value: null, coordinates: [2, 1] },
    { id: nanoid(), x: padding * 4 + cellSize * 3, y: padding * 2 + cellSize, value: null, coordinates: [3, 1] },
  ],
  [
    { id: nanoid(), x: padding, y: padding * 3 + cellSize * 2, value: null, coordinates: [0, 2] },
    { id: nanoid(), x: padding * 2 + cellSize, y: padding * 3 + cellSize * 2, value: null, coordinates: [1, 2] },
    { id: nanoid(), x: padding * 3 + cellSize * 2, y: padding * 3 + cellSize * 2, value: null, coordinates: [2, 2] },
    { id: nanoid(), x: padding * 4 + cellSize * 3, y: padding * 3 + cellSize * 2, value: null, coordinates: [3, 2] },
  ],
  [
    { id: nanoid(), x: padding, y: padding * 4 + cellSize * 3, value: null, coordinates: [0, 3] },
    { id: nanoid(), x: padding * 2 + cellSize, y: padding * 4 + cellSize * 3, value: null, coordinates: [1, 3] },
    { id: nanoid(), x: padding * 3 + cellSize * 2, y: padding * 4 + cellSize * 3, value: null, coordinates: [2, 3] },
    { id: nanoid(), x: padding * 4 + cellSize * 3, y: padding * 4 + cellSize * 3, value: null, coordinates: [3, 3] },
  ],
];

export type TBoard = {
  index: number;
  size: number;
  color: string;
  strokeColor: string;
  padding: number;
  font: string;
  fontSize: number;
  fontColor: string;
  map: TMap[][];
}

export type TCell = {
  size: number;
}

export type TGame = {
  size: number;
}

export type Config = {
  board: TBoard;
  cell: TCell;
  game: TGame;
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
  game: {
    size: gameSize,
  },
};

export interface GameConstruct {
  tile: (constructor: TileConstructor) => Tile;
  cell: (constructor: CellConstructor) => Cell;
  board: (constructor: BoardConstructor) => Board;
}

const ctx = canvas.getContext('2d');
canvas.width = boardSize;
canvas.height = boardSize;
const game = new Game({
  ctx,
  config: gameConfig,
  engine: {
    tile: ({
      ctx,
      coordinates,
      config,
      value,
    }) => new Tile({
      ctx,
      coordinates,
      value,
      config,
    }),
    cell: ({
      ctx,
      size,
      config,
      coordinates,
    }) => new Cell({
      ctx,
      size,
      config,
      coordinates,
    }),
    board: ({
      ctx,
      config,
    }) => new Board({
      ctx,
      config,
    }),
  },
});
game.start();

