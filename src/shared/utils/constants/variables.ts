import { Coordinates } from '../../types/coordinates';

const colorBlack = '#000';
const colorBackground = '#bbada0';
const colorBrown = '#8f7a66';
const fontColor = '#776e65';
const textScoreColor = '#eee4da';
const font = `Clear Sans, 'Helvetica Neue', 'Arial', sans-serif`;
const boardSize = 572;
const canvasWidth = window.innerWidth < boardSize - 20 ? window.innerWidth - 20 : boardSize;
const canvasHeight = window.innerHeight < boardSize * 1.31
  ? window.innerHeight - 100
  : boardSize * 1.31;
const padding = 12;
const contentHeight = canvasWidth * 1.01;
const headerHeight = canvasHeight - contentHeight;
const cellSize = window.innerWidth < boardSize - 20 ? canvasWidth / 4 - padding * 1.25 : 128;
const scoreHeight = 55;
const scoreWidth = canvasWidth / 2 - 6;
const fontSize = window.innerWidth < boardSize - 20 ? 20 : 40;
const scorePosition: Coordinates = [canvasWidth / 2 + padding / 2, 0];
const bestScorePosition: Coordinates = window.innerWidth < boardSize - 20 ? [0, 0] : [0, 0];
const gameSize = 4;
const buttonPosition: Coordinates = window.innerWidth < boardSize - 20 ? [0, scoreHeight + fontSize + padding * 2] : [0, scoreHeight + fontSize + padding];
const buttonTitle = 'Restart';
const scoreFontSize = 30;

export {
  colorBlack,
  scoreFontSize,
  colorBackground,
  textScoreColor,
  buttonTitle,
  colorBrown,
  fontColor,
  font,
  boardSize,
  canvasWidth,
  canvasHeight,
  padding,
  contentHeight,
  headerHeight,
  cellSize,
  scoreHeight,
  scoreWidth,
  fontSize,
  scorePosition,
  bestScorePosition,
  gameSize,
  buttonPosition
}
