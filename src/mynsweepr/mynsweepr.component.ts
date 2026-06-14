import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MynsweeprService } from './mynsweepr.service.js';
import { BoardState } from '@mynclasses/board-state.js';
import { DialogService } from '@dialog/dialog.service.js';
import { DialogComponent } from '@dialog/dialog.component.js';

@Component({
    selector: 'app-mynsweepr',
    templateUrl: './mynsweepr.component.html',
    styleUrls: ['./mynsweepr.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MynsweeprComponent implements OnInit {
  state: BoardState = new BoardState();

  constructor(private mynsweeprSvc: MynsweeprService, private dialogSvc: DialogService) {
    this.dialogSvc.dialogClosed.subscribe((dialog: DialogComponent) => {
      const dialogId = dialog.id() ?? '';
      if (['lost','won'].includes(dialogId)) {
        this.mynsweeprSvc.acknowledgedStatus(this.state);
      }
    });
    this.mynsweeprSvc.board.subscribe((state: BoardState) => {
      this.state = state;
      if (state.status) {
        switch (state.status) {
          case 'lost':
            this.dialogSvc.open('lost');
            break;
          case 'won':
            this.dialogSvc.open('won');
            break;
        }
      }
    });
  }

  closeDialog(id: string) {
    this.dialogSvc.close(id);
  }

  ngOnInit() {
  }

}
