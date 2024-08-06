import { TMap } from '../../types/map';

export const checkWin = (matrix: TMap[][]): boolean => {
  for (let x: number = 0; x < matrix.length; x++) {
    for (let y: number = 0; y < matrix.length; y++) {
      if (matrix[x][y].value >= 2048) {
        return true;
      }
    }
  }
  return false;
};
