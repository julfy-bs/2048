import '../public/index.css';
import { Game } from './features/game';
import { Board } from './shared/ui/components/board';
import { Button } from './shared/ui/components/button';
import { Cell } from './shared/ui/components/cell';
import { Score } from './shared/ui/components/score';
import { Tile } from './shared/ui/components/tile';
import { canvasHeight, canvasWidth, config } from './shared/utils/constants';

const canvas: HTMLCanvasElement = document.querySelector('#canvas');

const ctx = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const game = new Game({
  canvas,
  ctx,
  config,
  engine: {
    tile: ({
      ctx,
      coordinates,
      config,
      value,
    }) => new Tile({
      ctx,
      coordinates,
      value,
      config,
    }),
    cell: ({
      ctx,
      size,
      config,
      coordinates,
    }) => new Cell({
      ctx,
      size,
      config,
      coordinates,
    }),
    board: ({
      ctx,
      config,
    }) => new Board({
      ctx,
      config,
    }),
    score: ({
      ctx,
      config,
      position,
      value,
      title,
    }) => new Score({
      ctx,
      config,
      position,
      value,
      title,
    }),
    button: ({
      ctx,
      config,
      position,
      title,
    }) => new Button({
      ctx,
      config,
      position,
      title,
    }),
  },
});
game.start();

