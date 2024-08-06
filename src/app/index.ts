import '../../index.css';
import { nanoid } from 'nanoid';
import { Game } from '../features/game';
import { Board, BoardConstructor } from '../shared/ui/components/board';
import { Cell, CellConstructor } from '../shared/ui/components/cell';
import { Score, ScoreConstructor } from '../shared/ui/components/score';
import { Tile, TileConstructor } from '../shared/ui/components/tile';

const canvas: HTMLCanvasElement = document.querySelector('#canvas');

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
const fontColor = '#776e65';
const font = `Clear Sans, 'Helvetica Neue', 'Arial', sans-serif`;
const boardSize = 572;
const canvasWidth = window.innerWidth < boardSize - 20 ? window.innerWidth - 20 : boardSize;
const canvasHeight = window.innerHeight < boardSize * 1.25
  ? window.innerHeight - 60
  : boardSize * 1.25;
const padding = 12;
const contentHeight = canvasWidth;
const headerHeight = canvasHeight - contentHeight;
const cellSize = window.innerWidth < boardSize - 20 ? canvasWidth / 4 - padding * 1.25 : 128;
const scoreHeight = 55;
const scoreWidth = window.innerWidth < boardSize - 20
  ? canvasWidth
  : canvasWidth / 2 - 6;
const fontSize = window.innerWidth < boardSize - 20 ? 20 : 40;
const scorePosition: Coordinates = window.innerWidth < boardSize - 20 ? [0, fontSize + scoreHeight + padding / 2] : [canvasWidth / 2 + padding / 2, 0];
const bestScorePosition: Coordinates = window.innerWidth < boardSize - 20 ? [0, 0] : [0, 0];
const gameSize = 4;

export const getRandomCoords = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const map: TMap[][] = [
  [
    { id: nanoid(), x: padding, y: headerHeight + padding, value: null, coordinates: [0, 0] },
    {
      id: nanoid(),
      x: padding * 2 + cellSize,
      y: headerHeight + padding,
      value: null,
      coordinates: [1, 0],
    },
    {
      id: nanoid(),
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding,
      value: null,
      coordinates: [2, 0],
    },
    {
      id: nanoid(),
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding,
      value: null,
      coordinates: [3, 0],
    },
  ],
  [
    {
      id: nanoid(),
      x: padding,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [0, 1],
    },
    {
      id: nanoid(),
      x: padding * 2 + cellSize,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [1, 1],
    },
    {
      id: nanoid(),
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [2, 1],
    },
    {
      id: nanoid(),
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [3, 1],
    },
  ],
  [
    {
      id: nanoid(),
      x: padding,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [0, 2],
    },
    {
      id: nanoid(),
      x: padding * 2 + cellSize,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [1, 2],
    },
    {
      id: nanoid(),
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [2, 2],
    },
    {
      id: nanoid(),
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [3, 2],
    },
  ],
  [
    {
      id: nanoid(),
      x: padding,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [0, 3],
    },
    {
      id: nanoid(),
      x: padding * 2 + cellSize,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [1, 3],
    },
    {
      id: nanoid(),
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [2, 3],
    },
    {
      id: nanoid(),
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [3, 3],
    },
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

export type TCanvas = {
  width: number;
  headerHeight: number;
  contentHeight: number;
}

export type TGameScore = {
  score: TScore;
  bestScore: TScore;
  font: string;
  fontColor: string;
  fontSize: number;
  color: string;
  height: number;
  width: number;
}

export type TScore = {
  position: Coordinates;
}

export type TButton = {
  width: number;
  height: number;
  color: string;
}

export type Config = {
  board: TBoard;
  cell: TCell;
  game: TGame;
  canvas: TCanvas;
  score: TGameScore;
  button: TButton;
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
  canvas: {
    width: canvasWidth,
    headerHeight,
    contentHeight,
  },
  score: {
    score: {
      position: scorePosition,
    },
    bestScore: {
      position: bestScorePosition,
    },
    height: scoreHeight,
    width: scoreWidth,
    color: '#bbada0',
    font: font,
    fontColor: '#eee4da',
    fontSize: 30,
  },
  button: {
    height: scoreHeight,
    width: scoreWidth,
    color: '8f7a66',
  }
};

export interface GameConstruct {
  tile: (constructor: TileConstructor) => Tile;
  cell: (constructor: CellConstructor) => Cell;
  board: (constructor: BoardConstructor) => Board;
  score: (constructor: ScoreConstructor) => Score;
}

const ctx = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
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
    score: ({
      ctx,
      config,
      position,
      value,
      title,
    }) => new Score({
      ctx,
      config,
      position,
      value,
      title,
    }),
  },
});
game.start();

