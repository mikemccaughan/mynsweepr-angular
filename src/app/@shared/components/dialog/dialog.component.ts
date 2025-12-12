import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  output,
  input
} from '@angular/core';
import { DialogService } from './dialog.service';
import { Utils } from '../../../../mynsweepr/classes/utils';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.sass'],
    standalone: false
})
export class DialogComponent implements OnInit {
  constructor(
    public dialogService: DialogService,
    public element: ElementRef
  ) { }

  public readonly id = input<string>();
  public readonly title = input<string>();
  public readonly classes = input<{
    [key: string]: boolean;
}>();

  public readonly closed = output<string>();

  @HostListener('keyup', ['$event'])
  public dialogKeyup(event: KeyboardEvent) {
    if (event && event.key === 'Escape') {
      this.close();
    }
  }

  public previouslyFocused: Element | null  = null;

  ngOnInit() {
    const id = this.id() ?? '';
    if (!id) {
      throw new Error('Dialog id is not defined');
    }
    this.dialogService.register(id, this);
  }

  open() {
    this.previouslyFocused = document.activeElement;
    const classes = this.classes();
    if (!classes) {
      throw new Error('Dialog classes are not defined');
    }
    classes.show = true;
    this.element.nativeElement.querySelector('a[href],input,button,select').focus();
  }

  close() {
    const classes = this.classes();
    if (!classes) {
      throw new Error('Dialog classes are not defined');
    }
    let wasOpen = classes.show;
    classes.show = false;
    if (this.previouslyFocused && this.previouslyFocused instanceof HTMLElement) {
      this.previouslyFocused.focus();
    }
    if (wasOpen) {
      const id = this.id() ?? '';
      if (!Utils.isGood(id)) {
        throw new Error('Dialog id is not defined');
      }
      this.closed.emit(id);
    }
  }
}
