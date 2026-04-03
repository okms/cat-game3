import { describe, it, expect } from 'vitest';
import { LevelManager } from '@logic/level/level-manager';
import type { LevelData } from '@logic/level/level-data';
import level1 from '../../../public/assets/tilemaps/level-1.json';
import level2 from '../../../public/assets/tilemaps/level-2.json';
import level3 from '../../../public/assets/tilemaps/level-3.json';

const levels = [level1, level2, level3] as LevelData[];

describe('LevelManager', () => {
  it('should start at level 0', () => {
    const lm = new LevelManager(levels);

    expect(lm.currentLevelIndex).toBe(0);
    expect(lm.currentLevel.name).toBe('The Outskirts');
  });

  it('should advance to next level', () => {
    const lm = new LevelManager(levels);

    const hasNext = lm.advanceLevel();

    expect(hasNext).toBe(true);
    expect(lm.currentLevelIndex).toBe(1);
    expect(lm.currentLevel.name).toBe('The Depths');
  });

  it('should advance through all levels', () => {
    const lm = new LevelManager(levels);

    lm.advanceLevel(); // -> level 2
    const hasNext = lm.advanceLevel(); // -> level 3

    expect(hasNext).toBe(true);
    expect(lm.currentLevelIndex).toBe(2);
    expect(lm.currentLevel.name).toBe('The Heartstone');
  });

  it('should return false when no more levels', () => {
    const lm = new LevelManager(levels);

    lm.advanceLevel(); // -> 1
    lm.advanceLevel(); // -> 2
    const hasNext = lm.advanceLevel(); // no more

    expect(hasNext).toBe(false);
    expect(lm.currentLevelIndex).toBe(2); // stays at last
  });

  it('should report whether it is the last level', () => {
    const lm = new LevelManager(levels);

    expect(lm.isLastLevel).toBe(false);

    lm.advanceLevel();
    expect(lm.isLastLevel).toBe(false);

    lm.advanceLevel();
    expect(lm.isLastLevel).toBe(true);
  });

  it('should report total level count', () => {
    const lm = new LevelManager(levels);

    expect(lm.totalLevels).toBe(3);
  });

  it('should reset to first level', () => {
    const lm = new LevelManager(levels);

    lm.advanceLevel();
    lm.advanceLevel();
    lm.reset();

    expect(lm.currentLevelIndex).toBe(0);
    expect(lm.currentLevel.name).toBe('The Outskirts');
  });
});
