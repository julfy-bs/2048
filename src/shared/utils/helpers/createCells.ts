import { Config } from '../../types/config';
import { Cell } from '../../ui/components/cell';
import { CellConstructor } from '../../ui/components/cell/types';

type Constructor = {
  ctx: CanvasRenderingContext2D;
  config: Config;
  cell: (constructor: CellConstructor) => Cell;
}

export const createCells = (constructor: Constructor): Cell[] => {
  const { ctx, config, cell: createCell } = constructor;
  const cells: Cell[] = [];
  for (let x = 0; x < config.board.map.length; x++) {
    for (let y = 0; y < config.board.map.length; y++) {
      const newCell = createCell({
        ctx: ctx,
        size: config.cell.size,
        config: config,
        coordinates: config.board.map[x][y].coordinates,
      });
      cells.push(newCell);
    }
  }

  return cells;
};
