import { TGameScore } from './gameScore';
import { TBoard } from './board';
import { TButton } from './button';
import { TCanvas } from './canvas';
import { TCell } from './cell';
import { TGame } from './game';

export type Config = {
  board: TBoard;
  cell: TCell;
  game: TGame;
  canvas: TCanvas;
  score: TGameScore;
  button: TButton;
}
