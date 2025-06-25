import { Difficulty } from './difficulty';
import { Mineboard } from './mineboard';
import { Scoreboard } from './scoreboard';
import { ITimer, Timer } from './timer';

/**
 *  Represents the state of the Minesweeper game board.
 */
export class BoardState {
  /**
   *  The difficulty settings for the game, including type, width, and height.
   */
  difficulty: Difficulty;
  /**
   *  The mineboard containing the cells of the game.
   */
  mineboard: Mineboard;
  /**
   *  The scoreboard that tracks the player's score and time.
   */
  scoreboard: Scoreboard;
  /**
   *  The timer that tracks the elapsed time during the game.
   */
  timer: ITimer;
  /**
   *  The ID of the timer, used to manage the game state.
   */
  timerId?: number;
  /**
   *  The current status of the game, such as 'playing', 'won', or 'lost'.
   */
  status?: string;
  constructor() {
    this.difficulty = new Difficulty();
    this.mineboard = new Mineboard();
    this.scoreboard = new Scoreboard();
    this.timer = new Timer();
    this.timer.elapsed.subscribe(this.timerElapsedChanged.bind(this));
    this.mineboard.remainingChanged.subscribe(this.remainingChanged.bind(this));
    this.difficulty.heightChanged.subscribe(this.difficultyHeightChanged.bind(this));
    this.difficulty.widthChanged.subscribe(this.difficultyWidthChanged.bind(this));
    this.difficulty.typeChanged.subscribe(this.difficultyTypeChanged.bind(this));
  }
  timerElapsedChanged(elapsed: string): string {
    this.scoreboard.timeElapsed = elapsed;
    return elapsed;
  }
  remainingChanged(remaining: number): void {
    this.scoreboard.minesRemaining = remaining;
  }
  difficultyHeightChanged(height: number): void {
    this.mineboard.difficulty = {
      ...this.mineboard.difficulty,
      height
    };
    this.timer.reset();
    this.loadHighScore();
    this.mineboard.buildBoard();
  }
  difficultyWidthChanged(width: number): void {
    this.mineboard.difficulty = {
      ...this.mineboard.difficulty,
      width
    };
    this.timer.reset();
    this.loadHighScore();
    this.mineboard.buildBoard();
  }
  difficultyTypeChanged(type: string): void {
    const w = isNaN(parseInt(type, 10)) ? 30 : parseInt(type, 10);
    const h = type === '9' ? 9 : type === '16' ? 16 : type === '30' ? 16 : 16;
    this.mineboard.difficulty = {
      type,
      width: w,
      height: h
    };
    this.difficulty.width = w;
    this.difficulty.height = h;
    this.timer.reset();
    this.loadHighScore();
    this.mineboard.buildBoard();
  }
  loadHighScore() {
    this.scoreboard.loadScores();
    const difficulty = JSON.stringify(JSON.stringify(this.mineboard.difficulty));
    this.scoreboard.highScore = this.scoreboard.highScores[difficulty] ?? '--:--:--';
  }
}
