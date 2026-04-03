import { describe, it, expect } from 'vitest';
import { PhysicsWorld } from '@logic/physics/physics-world';
import { Entity } from '@logic/entities/entity';

describe('PhysicsWorld', () => {
  it('should apply gravity to entity velocity over time', () => {
    const world = new PhysicsWorld({ gravity: 500 });
    const entity = new Entity({ x: 0, y: 0, width: 48, height: 48 });

    world.applyGravity(entity, 1);

    expect(entity.velocityY).toBe(500);
  });

  it('should accumulate gravity over multiple steps', () => {
    const world = new PhysicsWorld({ gravity: 500 });
    const entity = new Entity({ x: 0, y: 0, width: 48, height: 48 });

    world.applyGravity(entity, 0.5);
    world.applyGravity(entity, 0.5);

    expect(entity.velocityY).toBe(500);
  });

  it('should integrate velocity into position', () => {
    const world = new PhysicsWorld({ gravity: 500 });
    const entity = new Entity({ x: 0, y: 0, width: 48, height: 48 });
    entity.velocityX = 100;
    entity.velocityY = 200;

    world.integrate(entity, 1);

    expect(entity.x).toBe(100);
    expect(entity.y).toBe(200);
  });

  it('should integrate velocity for fractional dt', () => {
    const world = new PhysicsWorld({ gravity: 500 });
    const entity = new Entity({ x: 0, y: 0, width: 48, height: 48 });
    entity.velocityX = 200;

    world.integrate(entity, 0.016); // ~60fps

    expect(entity.x).toBeCloseTo(3.2, 1);
  });
});
