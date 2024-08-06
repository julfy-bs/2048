import { Board } from '../ui/components/board';
import { BoardConstructor } from '../ui/components/board/types';
import { Button } from '../ui/components/button';
import { ButtonConstructor } from '../ui/components/button/types';
import { Cell } from '../ui/components/cell';
import { CellConstructor } from '../ui/components/cell/types';
import { Score } from '../ui/components/score';
import { ScoreConstructor } from '../ui/components/score/types';
import { Tile } from '../ui/components/tile';
import { TileConstructor } from '../ui/components/tile/types';

export interface GameConstruct {
  tile: (constructor: TileConstructor) => Tile;
  cell: (constructor: CellConstructor) => Cell;
  board: (constructor: BoardConstructor) => Board;
  score: (constructor: ScoreConstructor) => Score;
  button: (constructor: ButtonConstructor) => Button;
}
