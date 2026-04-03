export enum GameState {
  Menu = 'menu',
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'gameover',
  Victory = 'victory',
}

const VALID_TRANSITIONS: Record<GameState, GameState[]> = {
  [GameState.Menu]: [GameState.Playing],
  [GameState.Playing]: [GameState.Paused, GameState.GameOver, GameState.Victory],
  [GameState.Paused]: [GameState.Playing, GameState.Menu],
  [GameState.GameOver]: [GameState.Menu],
  [GameState.Victory]: [GameState.Menu],
};

export class GameStateMachine {
  current: GameState = GameState.Menu;

  transition(to: GameState): boolean {
    const allowed = VALID_TRANSITIONS[this.current];
    if (!allowed.includes(to)) return false;
    this.current = to;
    return true;
  }
}
