import { TMap } from '../../types/map';

type Constructor = {
  matrix: TMap[][];
  isCreatingTilesAvailable: boolean;
}

export const checkLose = (constructor: Constructor): boolean => {
  const { matrix, isCreatingTilesAvailable } = constructor;
  for (let x: number = 0; x < matrix.length; x++) {
    for (let y: number = 0; y < matrix.length; y++) {

      if (matrix[x][y].value === null) {
        return false;
      }

      if (x !== 0 && matrix[x][y].value === matrix[x - 1][y].value) {
        return false;
      }

      if (x !== 3 && matrix[x][y].value === matrix[x + 1][y].value) {
        return false;
      }

      if (y !== 0 && matrix[x][y].value === matrix[x][y - 1].value) {
        return false;
      }

      if (y !== 3 && matrix[x][y].value === matrix[x][y + 1].value) {
        return false;
      }

      if (isCreatingTilesAvailable) {
        console.log(isCreatingTilesAvailable);
        return false;
      }
    }
  }

  return true;
};
