import { describe, it, expect } from 'vitest';
import { aabbOverlap, resolveTopCollision, CollisionSide, detectCollisionSide } from '@logic/physics/collision';
import { Entity } from '@logic/entities/entity';

describe('aabbOverlap', () => {
  it('should detect overlapping entities', () => {
    const a = new Entity({ x: 0, y: 0, width: 50, height: 50 });
    const b = new Entity({ x: 25, y: 25, width: 50, height: 50 });

    expect(aabbOverlap(a, b)).toBe(true);
  });

  it('should not detect non-overlapping entities', () => {
    const a = new Entity({ x: 0, y: 0, width: 50, height: 50 });
    const b = new Entity({ x: 100, y: 100, width: 50, height: 50 });

    expect(aabbOverlap(a, b)).toBe(false);
  });

  it('should not detect entities that are exactly touching edges', () => {
    const a = new Entity({ x: 0, y: 0, width: 50, height: 50 });
    const b = new Entity({ x: 50, y: 0, width: 50, height: 50 });

    expect(aabbOverlap(a, b)).toBe(false);
  });

  it('should detect entities sharing only a small overlap', () => {
    const a = new Entity({ x: 0, y: 0, width: 50, height: 50 });
    const b = new Entity({ x: 49, y: 49, width: 50, height: 50 });

    expect(aabbOverlap(a, b)).toBe(true);
  });
});

describe('detectCollisionSide', () => {
  it('should detect collision from top (landing on platform)', () => {
    const player = new Entity({ x: 10, y: 40, width: 48, height: 48 });
    player.velocityY = 100; // falling down
    const platform = new Entity({ x: 0, y: 80, width: 100, height: 20 });

    expect(detectCollisionSide(player, platform)).toBe(CollisionSide.Top);
  });

  it('should detect collision from right side of obstacle', () => {
    const player = new Entity({ x: 90, y: 10, width: 48, height: 48 });
    player.velocityX = -100;
    const wall = new Entity({ x: 50, y: 0, width: 50, height: 100 });

    expect(detectCollisionSide(player, wall)).toBe(CollisionSide.Right);
  });

  it('should detect collision from left side of obstacle', () => {
    const player = new Entity({ x: 5, y: 10, width: 48, height: 48 });
    player.velocityX = 100;
    const wall = new Entity({ x: 50, y: 0, width: 50, height: 100 });

    expect(detectCollisionSide(player, wall)).toBe(CollisionSide.Left);
  });

  it('should detect collision from bottom (hitting head)', () => {
    const player = new Entity({ x: 10, y: 30, width: 48, height: 48 });
    player.velocityY = -100; // jumping up
    const ceiling = new Entity({ x: 0, y: 0, width: 100, height: 35 });

    expect(detectCollisionSide(player, ceiling)).toBe(CollisionSide.Bottom);
  });
});

describe('resolveTopCollision', () => {
  it('should place entity on top of platform and zero vertical velocity', () => {
    const entity = new Entity({ x: 10, y: 65, width: 48, height: 48 });
    entity.velocityY = 150;
    const platform = new Entity({ x: 0, y: 80, width: 100, height: 20 });

    resolveTopCollision(entity, platform);

    expect(entity.y).toBe(platform.y - entity.height);
    expect(entity.velocityY).toBe(0);
  });
});
