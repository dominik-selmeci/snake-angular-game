import { Position } from './snake.service';
import { GameConfig } from './game.service';

export class DrawService {
  blockSize = 20;
  blockPadding = 1;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  initCanvas(config: GameConfig) {
    this.canvas['width'] = this.getCanvasWidth(config);
    this.canvas['height'] = this.getCanvasHeight(config);
  }

  clearCanvas(config: GameConfig) {
    const ctx = this.canvas.getContext('2d');
    ctx?.clearRect(
      0,
      0,
      this.getCanvasWidth(config),
      this.getCanvasHeight(config)
    );
  }

  drawBorder(config: GameConfig) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.setLineDash([config.options.canGoThroughWalls ? this.blockSize : 0]);
    const strokeStyle = 'purple';
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = this.blockSize / 2;
    ctx.strokeRect(
      this.blockSize / 4,
      this.blockSize / 4,
      this.getCanvasWidth(config) - this.blockSize / 2,
      this.getCanvasHeight(config) - this.blockSize / 2
    );
  }

  drawSnack(position: Position) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(
      position.x * this.blockSize + this.blockSize / 2 + this.blockSize / 2,
      position.y * this.blockSize + this.blockSize / 2 + this.blockSize / 2,
      this.blockSize / 2 - this.blockPadding,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  drawSnake(positions: Position[]) {
    const fillStyle = (opacity: number) => `rgba(215, 108, 38, ${opacity})`;
    positions.forEach((position, i) => {
      this.drawRect(
        position,
        fillStyle((positions.length - i) / positions.length)
      );
    });
  }

  getCanvasHeight(config: GameConfig) {
    return config.verticalBlocks * this.blockSize + this.blockSize;
  }

  getCanvasWidth(config: GameConfig) {
    return config.horizontalBlocks * this.blockSize + this.blockSize;
  }

  private drawRect(position: Position, fillStyle = '#505050') {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.fillStyle = fillStyle;
    ctx.fillRect(
      position.x * this.blockSize + this.blockPadding + this.blockSize / 2,
      position.y * this.blockSize + this.blockPadding + this.blockSize / 2,
      this.blockSize - 2 * this.blockPadding,
      this.blockSize - 2 * this.blockPadding
    );
  }
}
