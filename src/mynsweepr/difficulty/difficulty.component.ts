import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { BoardState, Difficulty } from '../classes/index.js';
import { MynsweeprService } from '../mynsweepr.service.js';

@Component({
    selector: 'app-difficulty',
    templateUrl: './difficulty.component.html',
    styleUrls: ['./difficulty.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DifficultyComponent implements OnInit {
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  public difficulty: Difficulty = new Difficulty();

  private board: BoardState = new BoardState();

  constructor(private boardSvc: MynsweeprService) {
    this.boardSvc.board.subscribe((board: BoardState) => {
      this.board = board;
      this.difficulty = board.difficulty;
    });
  }

  ngOnInit() {
  }
}
