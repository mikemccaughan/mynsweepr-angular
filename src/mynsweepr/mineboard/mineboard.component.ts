import { Component, OnInit, input } from '@angular/core';
import { Minecell, Mineboard, BoardState } from '../classes';
import { MynsweeprService } from '../mynsweepr.service';
import { Utils } from '../classes/utils';

@Component({
    selector: 'app-mineboard',
    templateUrl: './mineboard.component.html',
    styleUrls: ['./mineboard.component.sass'],
    standalone: false
})
export class MineboardComponent implements OnInit {
  readonly mineboard = input<Mineboard>();

  public readonly cells: Minecell[] = this.mineboard()?.cells ?? [];
  public cell: Minecell = new Minecell();

  private board: BoardState = new BoardState();

  get classes(): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      mineboard: true,
      'type-9': false,
      'type-16': false,
      'type-30': false
    };
    const mineboard = this.mineboard();
    if (mineboard && mineboard.difficulty && mineboard.difficulty.type) {
      classes[`type-${mineboard.difficulty.type}`] = true;
      if (mineboard.difficulty.type === '?' && mineboard.difficulty.width) {
        // Adds a rule with selector .type-? with property grid-template-columns set to repeat(<width>, min-content).
        // Example: a 65-column board gets:
        // .type-\? {
        //   grid-template-columns: repeat(65, min-content);
        // }
        Utils.redefineClass('type-\\?', `grid-template-columns: repeat(${mineboard.difficulty.width}, min-content);`);
      }
    }
    return classes;
  }

  constructor(private boardSvc: MynsweeprService) {
    this.boardSvc.board.subscribe(board => this.board = board);
  }

  ngOnInit() {
  }
}
