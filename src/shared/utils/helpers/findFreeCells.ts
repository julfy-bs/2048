import { Coordinates } from '../../types/coordinates';
import { TMap } from '../../types/map';

type Payload = {
  freeCells: Coordinates[];
  isCreatingTilesAvailable: boolean;
}

export const findFreeCells = (matrix: TMap[][]): Payload => {
  const freeCells: Coordinates[] = [];

  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      if (matrix[x][y].value === null) {
        freeCells.push([x, y]);
      }
    }
  }

  return {
    freeCells,
    isCreatingTilesAvailable: freeCells.length > 0
  }
}
