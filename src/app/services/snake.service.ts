import { Injectable } from '@angular/core';
import { GameConfig, GameOptions } from './game.service';

export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export enum TurnResult {
  Step,
  EatingSnack,
  Collision,
}

@Injectable({
  providedIn: 'root'
})
export class SnakeService {
  positions: Position[];
  snackPosition: Position;
  options: GameOptions;

  private _direction: Direction;
  public get direction() { return this._direction; }
  public set direction(direction: Direction) {
    if (!this.isReverseDirection(direction)) {
      this._direction = direction;
    }
  }

  constructor() {
    this.initStartingPosition();
  }

  initStartingPosition() {
    this.positions = [
      {x: 4, y: 2},
      {x: 3, y: 2},
      {x: 2, y: 2},
    ];
    this.direction = Direction.Right;
  }

  generateSnack(config: GameConfig) {
    this.snackPosition = {
      x: this.getRandomInt(0, config.horizontalBlocks - 1),
      y: this.getRandomInt(0, config.verticalBlocks - 1),
    };
  }

  turn(config: GameConfig) {
    if (this.hasCollision(config)) {
      return TurnResult.Collision;
    }

    this.positions.unshift(this.getNewPosition(config));

    if (this.isEatingSnack()) {
      this.generateSnack(config);
      return TurnResult.EatingSnack;
    }

    this.positions.pop();
    return TurnResult.Step;
  }

  private hasCollision(config: GameConfig): boolean {
    return this.isWallCollision(config) || this.isSnakeCollision();
  }

  private getNewPosition(config?: GameConfig): Position {
    const newPos = {
      x: this.positions[0].x,
      y: this.positions[0].y
    };
    switch (this.direction) {
      case Direction.Up: newPos.y--; break;
      case Direction.Down: newPos.y++; break;
      case Direction.Left: newPos.x--; break;
      case Direction.Right: newPos.x++; break;
    }

    if (this.options.canGoThroughWalls && config) {
      if (newPos.x >= config.horizontalBlocks) { newPos.x = 0; }
      if (newPos.x < 0) { newPos.x = config.horizontalBlocks - 1; }
      if (newPos.y >= config.verticalBlocks) { newPos.y = 0; }
      if (newPos.y < 0) { newPos.y = config.verticalBlocks - 1; }
    }

    return newPos;
  }

  private isWallCollision(config: GameConfig): boolean {
    if (this.options.canGoThroughWalls) {
      return false;
    }

    const newPos = this.getNewPosition();
    const horizontalCheck = newPos.x < 0 || newPos.x > config.horizontalBlocks - 1;
    const verticalCheck = newPos.y < 0 || newPos.y > config.verticalBlocks - 1;

    return horizontalCheck || verticalCheck;
  }

  private isSnakeCollision(): boolean {
    if (this.options.canGoThroughItself) {
      return false;
    }

    const newPos = this.getNewPosition();
    const collisionBlock = this.positions.find((pos) => pos.x === newPos.x && pos.y === newPos.y);
    return !!collisionBlock;
  }

  private isReverseDirection(direction: Direction): boolean {
    const firstPos = this.positions[0];
    const secondPos = this.positions[1];

    switch (direction) {
      case Direction.Up: return firstPos.y === secondPos.y + 1;
      case Direction.Down: return firstPos.y === secondPos.y - 1;
      case Direction.Left: return firstPos.x === secondPos.x + 1;
      case Direction.Right: return firstPos.x === secondPos.x - 1;
    }
  }

  private isEatingSnack(): boolean {
    const firstPos = this.positions[0];
    return firstPos.x === this.snackPosition.x && firstPos.y === this.snackPosition.y;
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
