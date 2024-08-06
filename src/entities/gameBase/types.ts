import { Board } from '../../shared/ui/components/board';
import { Button } from '../../shared/ui/components/button';
import { Cell } from '../../shared/ui/components/cell';
import { Score } from '../../shared/ui/components/score';
import { Tile } from '../../shared/ui/components/tile';
import { GameStatus } from '../../shared/utils/constants';

export type PossibleGameStatuses = GameStatus.OVER | GameStatus.CONTINUES | GameStatus.NEW | GameStatus.WIN;
export type CreateMethod = {
  board: () => Board;
  cell: () => Cell[];
  tile: () => Tile;
  score: () => Score;
  bestScore: () => Score;
  button: () => Button;
}

export type DrawMethod = {
  board: () => void;
  cell: () => void;
  tiles: () => void;
  score: () => void;
  bestScore: () => void;
  button: () => void;
  all: () => void;
}
