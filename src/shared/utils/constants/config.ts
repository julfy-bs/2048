import { Config } from '../../types/config';
import { map } from './map';
import {
  bestScorePosition, buttonPosition, buttonTitle,
  canvasWidth,
  cellSize, colorBackground, colorBlack, colorBrown, contentHeight,
  font,
  fontColor,
  fontSize,
  gameSize,
  headerHeight,
  padding, scoreFontSize, scoreHeight, scorePosition, scoreWidth, textScoreColor,
} from './variables';

export const config: Config = {
  board: {
    size: canvasWidth,
    color: colorBackground,
    strokeColor: colorBlack,
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
    headerHeight: headerHeight,
    contentHeight: contentHeight,
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
    color: colorBackground,
    font: font,
    fontColor: textScoreColor,
    fontSize: scoreFontSize,
  },
  button: {
    height: scoreHeight,
    width: canvasWidth,
    color: colorBrown,
    position: buttonPosition,
    title: buttonTitle
  }
};
