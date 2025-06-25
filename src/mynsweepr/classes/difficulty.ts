import { EventEmitter } from '@angular/core';

export class Difficulty {
  typeChanged: EventEmitter<string>;
  private typeField: string = '9'; // Default value
  public get type(): string {
    return this.typeField;
  }
  public set type(value: string) {
    if (this.typeField !== value) {
      this.typeField = value;
      this.typeChanged.emit(value);
    }
  }

  widthChanged: EventEmitter<number>;
  private widthField: number = 9; // Default value
  public get width(): number {
    return this.widthField;
  }
  public set width(value: number) {
    if (this.widthField !== value) {
      this.widthField = value;
      if (value === 9 && this.height === 9 && this.type !== '9') {
        this.type = '9';
      } else if (value === 16 && this.height === 16 && this.type !== '16') {
        this.type = '16';
      } else if (value === 30 && this.height === 16 && this.type !== '30') {
        this.type = '30';
      } else if (this.type !== '?') {
        this.type = '?'; // Set to '?' if width is not a standard size
      }
      this.widthChanged.emit(value);
    }
  }

  heightChanged: EventEmitter<number>;
  private heightField: number = 9; // Default value
  public get height(): number {
    return this.heightField;
  }
  public set height(value: number) {
    if (this.heightField !== value) {
      this.heightField = value;
      if (value === 9 && this.width === 9 && this.type !== '9') {
        this.type = '9';
      } else if (value === 16 && this.width === 16 && this.type !== '16') {
        this.type = '16';
      } else if (value === 16 && this.width === 30 && this.type !== '30') {
        this.type = '30';
      } else if (this.type !== '?') {
        this.type = '?'; // Set to '?' if width is not a standard size
      }
      this.heightChanged.emit(value);
    }
  }

  constructor() {
    this.typeChanged = new EventEmitter<string>();
    this.widthChanged = new EventEmitter<number>();
    this.heightChanged = new EventEmitter<number>();
  }

  toJSON() {
    return JSON.stringify({
      type: this.type,
      width: this.width,
      height: this.height
    });
  }
}
