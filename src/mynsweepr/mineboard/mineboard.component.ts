import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { Minecell, Mineboard, BoardState, Utils } from "../classes/index.js";
import { MynsweeprService } from "../mynsweepr.service.js";

@Component({
  selector: "app-mineboard",
  templateUrl: "./mineboard.component.html",
  styleUrls: ["./mineboard.component.sass"],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MineboardComponent {
  readonly mineboard = input<Mineboard>();

  public readonly cells: Minecell[] = this.mineboard()?.cells ?? [];
  public cell: Minecell = new Minecell();
  public board: BoardState = new BoardState();

  get classes(): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      mineboard: true,
      "type-9": false,
      "type-16": false,
      "type-30": false,
    };
    const mineboard = this.mineboard() ?? new Mineboard();
    if (Utils.isGood(mineboard.difficulty.type, 1, 3)) {
      classes[`type-${mineboard.difficulty.type}`] = true;
      if (mineboard.difficulty.type === "?" && mineboard.difficulty.width) {
        // Adds a rule with selector .type-? with property grid-template-columns set to repeat(<width>, min-content).
        // Example: a 65-column board gets:
        // .type-\? {
        //   grid-template-columns: repeat(65, min-content);
        // }
        Utils.redefineClass(
          "type-\\?",
          `grid-template-columns: repeat(${mineboard.difficulty.width}, min-content);`,
        );
      }
    }
    return classes;
  }

  constructor(private boardSvc: MynsweeprService) {
    this.boardSvc.board.subscribe((board: BoardState) => (this.board = board));
  }
}
