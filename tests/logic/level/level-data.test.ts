import { describe, it, expect } from 'vitest';
import type { LevelData } from '@logic/level/level-data';
import level1 from '../../../public/assets/tilemaps/level-1.json';

describe('LevelData', () => {
  it('should load level-1 JSON with required fields', () => {
    const level = level1 as LevelData;

    expect(level.name).toBe('The Outskirts');
    expect(level.width).toBeGreaterThan(0);
    expect(level.height).toBeGreaterThan(0);
    expect(level.playerSpawn).toBeDefined();
    expect(level.platforms.length).toBeGreaterThan(0);
    expect(level.doorPosition).toBeDefined();
  });

  it('should have a ground platform spanning the level width', () => {
    const level = level1 as LevelData;
    const ground = level.platforms.find(p => p.y >= 550);

    expect(ground).toBeDefined();
    expect(ground!.width).toBeGreaterThanOrEqual(level.width);
  });

  it('should have player spawn above ground', () => {
    const level = level1 as LevelData;

    expect(level.playerSpawn.y).toBeLessThan(550);
  });

  it('should have door at end of level', () => {
    const level = level1 as LevelData;

    expect(level.doorPosition.x).toBeGreaterThan(level.width / 2);
  });
});
