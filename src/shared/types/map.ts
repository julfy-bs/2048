import { Coordinates } from './coordinates';

export type TMap = {
  x: number;
  y: number;
  value: number | null;
  coordinates: Coordinates;
};
