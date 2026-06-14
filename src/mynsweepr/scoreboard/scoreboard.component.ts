import { Component, OnInit, input, ChangeDetectionStrategy } from '@angular/core';
import { BoardState, Scoreboard } from '../classes';
import { MynsweeprService } from '../mynsweepr.service';

@Component({
    selector: 'app-scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ScoreboardComponent implements OnInit {
  public readonly scoreboard = input<Scoreboard>();
  public highscore: string = '00:00:00';
  private board: BoardState = new BoardState();

  constructor(private boardSvc: MynsweeprService) {
    this.boardSvc.board.subscribe((board: BoardState) => {
      this.board = board;
      this.highscore = this.board.scoreboard.highScore;
    });
  }

  ngOnInit() {
  }

}
