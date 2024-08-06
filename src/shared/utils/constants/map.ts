import { TMap } from '../../types/map';
import { cellSize, headerHeight, padding } from './variables';

export const map: TMap[][] = [
  [
    { x: padding, y: headerHeight + padding, value: null, coordinates: [0, 0] },
    {
      x: padding * 2 + cellSize,
      y: headerHeight + padding,
      value: null,
      coordinates: [1, 0],
    },
    {
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding,
      value: null,
      coordinates: [2, 0],
    },
    {
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding,
      value: null,
      coordinates: [3, 0],
    },
  ],
  [
    {
      x: padding,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [0, 1],
    },
    {
      x: padding * 2 + cellSize,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [1, 1],
    },
    {
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [2, 1],
    },
    {
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding * 2 + cellSize,
      value: null,
      coordinates: [3, 1],
    },
  ],
  [
    {
      x: padding,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [0, 2],
    },
    {
      x: padding * 2 + cellSize,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [1, 2],
    },
    {
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [2, 2],
    },
    {
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding * 3 + cellSize * 2,
      value: null,
      coordinates: [3, 2],
    },
  ],
  [
    {
      x: padding,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [0, 3],
    },
    {
      x: padding * 2 + cellSize,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [1, 3],
    },
    {
      x: padding * 3 + cellSize * 2,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [2, 3],
    },
    {
      x: padding * 4 + cellSize * 3,
      y: headerHeight + padding * 4 + cellSize * 3,
      value: null,
      coordinates: [3, 3],
    },
  ],
];
