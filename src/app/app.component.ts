import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { GameService } from './services/game.service';

@Component({
  selector: 'sn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) private canvas;

  _gameSpeed = 200;
  get gameSpeed() { return this._gameSpeed; }
  set gameSpeed(speed: number) {
    this._gameSpeed = speed;
    this.game.setGameSpeed(speed);
  }

  constructor(public game: GameService) {}

  ngAfterViewInit() {
    this.game.setCanvas(this.canvas.nativeElement);
    this.game.start();
  }
}
