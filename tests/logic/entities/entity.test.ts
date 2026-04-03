import { describe, it, expect } from 'vitest';
import { Entity } from '@logic/entities/entity';

describe('Entity', () => {
  it('should initialize with position and size', () => {
    const entity = new Entity({ x: 10, y: 20, width: 48, height: 48 });

    expect(entity.x).toBe(10);
    expect(entity.y).toBe(20);
    expect(entity.width).toBe(48);
    expect(entity.height).toBe(48);
  });

  it('should start with zero velocity', () => {
    const entity = new Entity({ x: 0, y: 0, width: 48, height: 48 });

    expect(entity.velocityX).toBe(0);
    expect(entity.velocityY).toBe(0);
  });

  it('should compute bounding box edges', () => {
    const entity = new Entity({ x: 10, y: 20, width: 48, height: 48 });

    expect(entity.left).toBe(10);
    expect(entity.right).toBe(58);
    expect(entity.top).toBe(20);
    expect(entity.bottom).toBe(68);
  });
});
