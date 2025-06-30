import { Injectable } from '@angular/core';
import { BoardState } from './classes/board-state';
import { BehaviorSubject, first, firstValueFrom, Observable } from 'rxjs';
import { Direction } from './classes/direction';
import { Minecell } from './classes';
import { Coords } from './classes/coords';

/**
 * Provides methods to manage the game state of Mynsweepr.
 */
@Injectable({
  providedIn: 'root'
})
export class MynsweeprService {
  /**
   * BehaviorSubject to hold the current state of the game board.
   * Initialized with a new BoardState instance.
   */
  boardSource: BehaviorSubject<BoardState> = new BehaviorSubject<BoardState>(new BoardState());
  /**
   * Observable to allow components to subscribe to the board state.
   */
  board: Observable<BoardState> = this.boardSource.asObservable();

  constructor() { }

  /**
   * Sets the current game board state.
   * @param board The new board state to set.
   */
  setBoard(board: BoardState) {
    this.boardSource.next(board);
  }

  /**
   * Initializes a new game board with the cell at the given coordinates set as the active cell.
   * @param board The board state to modify.
   * @param x The x-coordinate of the active cell.
   * @param y The y-coordinate of the active cell.
   */
  setActiveCell(board: BoardState, x: number, y: number): void {
    board.mineboard.activeCoords.x = x;
    board.mineboard.activeCoords.y = y;
    const cell = board.mineboard.getCell(x, y);
    if (cell) {
      board.mineboard.cells.forEach(cel => cel.isActive = false);
      cell.isActive = true;
      this.setBoard(board);
    }
  }

  /**
   * Retrieves the currently active cell from the board state.
   * @param board The board state to retrieve the active cell from.
   * @returns The currently active cell.
   */
  getActiveCell(board: BoardState): Minecell {
    const { x, y } = board.mineboard.activeCoords;
    const cell = board.mineboard.getCell(x, y);
    if (!cell) {
      throw new Error(`No active cell found at coordinates (${x}, ${y})`);
    }
    return cell;
  }

  /**
   * Moves the active cell in the specified direction.
   * @param board The board state to modify.
   * @param direction The direction to move the active cell.
   */
  moveActiveCell(board: BoardState, direction: Direction): void {
    const { x, y } = board.mineboard.activeCoords;
    const coords = new Coords(x, y);
    if (!coords) { return; }
    const diff = board.difficulty;
    if (!diff) { return; }
    const maxX = diff.width;
    const maxY = diff.height;
    switch (direction) {
      case Direction.Down:
        if (coords.y < maxY - 1) {
          coords.y += 1;
        }
        break;
      case Direction.Left:
        if (coords.x > 0) {
          coords.x -= 1;
        }
        break;
      case Direction.Right:
        if (coords.x < maxX - 1) {
          coords.x += 1;
        }
        break;
      case Direction.Up:
        if (coords.y > 0) {
          coords.y -= 1;
        }
        break;
    }
    const activeCell = board.mineboard.getCell(coords.x, coords.y);
    this.activateCell(board, activeCell);
  }

  /**
   * Activates the specified cell on the board.
   * @param board The board state to modify.
   * @param cell The cell to activate.
   */
  activateCell(board: BoardState, cell?: Minecell): void {
    if (!cell) {
      return;
    }
    this.setActiveCell(board, cell.x, cell.y);
    this.setBoard(board);
  }

  /**
   * Reveals the specified cell on the board.
   * Starts the timer if not already running.
   * If the cell is a mine, it triggers a game over.
   * If the cell has no nearby mines, it recursively reveals surrounding cells.
   * @param board The board state to modify.
   * @param cell The cell to reveal.
   */
  async showCell(board: BoardState, cell: Minecell): Promise<void> {
    if (await firstValueFrom(board.timer.running) === false) {
      board.timerId = board.timer.start();
    }
    if (!cell.isHidden) {
      return;
    }

    cell.isHidden = false;
    if (cell.nearby === 0) {
      // clear all surrounding cells to one level deep of nearby
      await this.showSurroundingCells(board, cell);
    }

    if (cell.hasMine) {
      this.epicFail(board);
    }

    this.checkForWin(board);
    this.setBoard(board);
  }

  async checkForWin(board: BoardState): Promise<void> {
    if (board.mineboard.cells.every(cell => cell.isAFlaggedMine || cell.isDisplayedAndNotAMine)) {
      board.status = 'won';
      if (await firstValueFrom(board.timer.running) === true) {
        board.timer.stop(board.timerId!);
      }
      board.scoreboard.saveElapsed(board.difficulty);
      this.setBoard(board);
    }
  }

  async epicFail(board: BoardState): Promise<void> {
    board.mineboard.cells.filter(cell => cell.isHidden).forEach(cell => cell.isHidden = false);
    board.status = 'lost';
    if (await firstValueFrom(board.timer.running) === true) {
      board.timer.stop(board.timerId!);
    }
    this.setBoard(board);
  }

  acknowledgedStatus(board: BoardState): void {
    if (['lost', 'won'].includes(board.status ?? '')) {
      board.mineboard.buildBoard();
    }

    board.timer.reset();
    board.status = undefined;
    this.setBoard(board);
  }

  flagCell(board: BoardState, cell: Minecell): void {
    const cel = board.mineboard.getCell(cell.index, undefined);
    if (!cel) {
      return;
    }
    cel.hasFlag = !cell.hasFlag;
    this.checkForWin(board);
    this.setBoard(board);
  }

  getSurroundingCells(board: BoardState, cell: Minecell): Minecell[] {
    const cells: Minecell[] = [];
    let next = this.up(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    next = this.right(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    next = this.down(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    next = this.left(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    next = this.upRight(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    next = this.upLeft(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    next = this.downLeft(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    next = this.downRight(board, cell.x, cell.y);
    if (next) {
      cells.push(next);
    }
    return cells;
  }

  async showSurroundingCells(board: BoardState, cell: Minecell): Promise<void> {
    const surroundingCells = this.getSurroundingCells(board, cell);
    const flagCount = surroundingCells.filter(cel => cel.hasFlag).length;
    if (cell.nearby === 0 || cell.nearby === flagCount) {
      await Promise.all(surroundingCells.map(cel => !cel.hasFlag && this.showCell(board, cel)));
    }

    this.checkForWin(board);
    this.setBoard(board);
  }

  up(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x, y - 1);
  }

  down(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x, y + 1);
  }

  left(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x - 1, y);
  }

  right(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x + 1, y);
  }

  upRight(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x + 1, y - 1);
  }

  upLeft(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x - 1, y - 1);
  }

  downRight(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x + 1, y + 1);;
  }

  downLeft(board: BoardState, x: number, y: number): Minecell | undefined {
    return board.mineboard.getCell(x - 1, y + 1);
  }
}
