import { Component, OnInit, Input } from '@angular/core';
import { BoardState, Difficulty } from '../classes';
import { MynsweeprService } from '../mynsweepr.service';

@Component({
    selector: 'app-difficulty',
    templateUrl: './difficulty.component.html',
    styleUrls: ['./difficulty.component.sass'],
    standalone: false
})
export class DifficultyComponent implements OnInit {
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  public difficulty: Difficulty = new Difficulty();

  private board: BoardState = new BoardState();

  constructor(private boardSvc: MynsweeprService) {
    this.boardSvc.board.subscribe(board => this.board = board);
  }

  ngOnInit() {
  }
}
