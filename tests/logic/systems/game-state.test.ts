import { describe, it, expect } from 'vitest';
import { GameStateMachine, GameState } from '@logic/systems/game-state';

describe('GameStateMachine', () => {
  it('should start in menu state', () => {
    const sm = new GameStateMachine();

    expect(sm.current).toBe(GameState.Menu);
  });

  it('should transition from menu to playing', () => {
    const sm = new GameStateMachine();

    expect(sm.transition(GameState.Playing)).toBe(true);
    expect(sm.current).toBe(GameState.Playing);
  });

  it('should transition from playing to paused', () => {
    const sm = new GameStateMachine();
    sm.transition(GameState.Playing);

    expect(sm.transition(GameState.Paused)).toBe(true);
    expect(sm.current).toBe(GameState.Paused);
  });

  it('should transition from paused back to playing', () => {
    const sm = new GameStateMachine();
    sm.transition(GameState.Playing);
    sm.transition(GameState.Paused);

    expect(sm.transition(GameState.Playing)).toBe(true);
    expect(sm.current).toBe(GameState.Playing);
  });

  it('should transition from playing to game over', () => {
    const sm = new GameStateMachine();
    sm.transition(GameState.Playing);

    expect(sm.transition(GameState.GameOver)).toBe(true);
    expect(sm.current).toBe(GameState.GameOver);
  });

  it('should transition from playing to victory', () => {
    const sm = new GameStateMachine();
    sm.transition(GameState.Playing);

    expect(sm.transition(GameState.Victory)).toBe(true);
    expect(sm.current).toBe(GameState.Victory);
  });

  it('should transition from game over to menu', () => {
    const sm = new GameStateMachine();
    sm.transition(GameState.Playing);
    sm.transition(GameState.GameOver);

    expect(sm.transition(GameState.Menu)).toBe(true);
    expect(sm.current).toBe(GameState.Menu);
  });

  it('should transition from victory to menu', () => {
    const sm = new GameStateMachine();
    sm.transition(GameState.Playing);
    sm.transition(GameState.Victory);

    expect(sm.transition(GameState.Menu)).toBe(true);
  });

  it('should not allow invalid transitions', () => {
    const sm = new GameStateMachine();

    // Can't go from menu directly to game over
    expect(sm.transition(GameState.GameOver)).toBe(false);
    expect(sm.current).toBe(GameState.Menu);
  });

  it('should not allow paused from menu', () => {
    const sm = new GameStateMachine();

    expect(sm.transition(GameState.Paused)).toBe(false);
  });
});
