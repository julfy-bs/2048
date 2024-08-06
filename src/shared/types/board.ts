import { TMap } from './map';

export type TBoard = {
  size: number;
  color: string;
  strokeColor: string;
  padding: number;
  font: string;
  fontSize: number;
  fontColor: string;
  map: TMap[][];
}
