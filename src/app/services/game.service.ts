import { Injectable } from '@angular/core';
import { DrawService } from './draw.service';
import { SnakeService, Direction, TurnResult } from './snake.service';

export interface GameConfig {
  horizontalBlocks: number;
  verticalBlocks: number;
  gameSpeed: number;
  options: GameOptions;
}

export interface GameOptions {
  canGoThroughItself: boolean;
  canGoThroughWalls: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  config: GameConfig;
  draw!: DrawService;
  gameLoop: any;
  keydownListener!: EventListener;
  maxScore = 0;
  score = 0;

  constructor(private snake: SnakeService) {
    this.config = {
      horizontalBlocks: 16,
      verticalBlocks: 16,
      gameSpeed: 200,
      options: {
        canGoThroughItself: false,
        canGoThroughWalls: false,
      },
    };
    this.snake.options = this.config.options;
    this.snake.generateSnack(this.config);
  }

  gameOver() {
    if (this.maxScore < this.score) {
      this.maxScore = this.score;
    }
    this.score = 0;

    if (confirm("Game Over :'(, wanna try again?")) {
      this.restart();
    }
  }

  isRunning() {
    return !!this.gameLoop;
  }

  keydown(e: KeyboardEvent) {
    const allowedKeys = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'w',
      's',
      'a',
      'd',
    ];
    if (allowedKeys.indexOf(e.key) === -1) {
      return;
    }

    let direction!: Direction;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        direction = Direction.Up;
        break;
      case 'ArrowDown':
      case 's':
        direction = Direction.Down;
        break;
      case 'ArrowLeft':
      case 'a':
        direction = Direction.Left;
        break;
      case 'ArrowRight':
      case 'd':
        direction = Direction.Right;
        break;
    }

    this.snake.direction = direction;
  }

  restart() {
    this.stop();
    this.score = 0;
    this.snake.initStartingPosition();
    this.snake.generateSnack(this.config);
    this.start();
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.draw = new DrawService(canvas);
    this.draw.initCanvas(this.config);
  }

  setGameSpeed(speed: number) {
    this.config.gameSpeed = speed;
    this.stop();
    this.start();
  }

  start() {
    document.addEventListener('keydown', (e) => this.keydown(e));
    this.drawGame();
    this.initGameLoop();
  }

  stop() {
    document.removeEventListener('keydown', this.keydown);
    clearInterval(this.gameLoop);
    this.gameLoop = null;
  }

  private drawGame() {
    this.draw.clearCanvas(this.config);
    this.draw.drawBorder(this.config);
    this.draw.drawSnake(this.snake.positions);
    this.draw.drawSnack(this.snake.snackPosition);
  }

  private initGameLoop() {
    this.gameLoop = setInterval(() => {
      const turnResult: TurnResult = this.snake.turn(this.config);

      switch (turnResult) {
        case TurnResult.Collision:
          this.stop();
          this.gameOver();
          break;
        case TurnResult.EatingSnack:
          this.score++;
          break;
      }

      this.drawGame();
    }, this.config.gameSpeed);
  }
}
