import { describe, it, expect } from 'vitest';
import { Enemy } from '@logic/entities/enemy';
import { Player } from '@logic/entities/player';
import { aabbOverlap } from '@logic/physics/collision';

describe('Enemy', () => {
  function createEnemy() {
    return new Enemy({
      x: 200, y: 504, width: 48, height: 48,
      patrolMinX: 100, patrolMaxX: 400, speed: 80,
      damage: 25,
    });
  }

  describe('initialization', () => {
    it('should initialize at given position', () => {
      const enemy = createEnemy();

      expect(enemy.x).toBe(200);
      expect(enemy.y).toBe(504);
      expect(enemy.isAlive).toBe(true);
    });

    it('should have HP', () => {
      const enemy = createEnemy();

      expect(enemy.hp).toBe(1);
    });
  });

  describe('patrol movement', () => {
    it('should update velocity from patrol AI', () => {
      const enemy = createEnemy();

      enemy.update(0.016);

      expect(enemy.velocityX).toBe(80);
    });

    it('should reverse at patrol boundary', () => {
      const enemy = createEnemy();
      enemy.x = 400;

      enemy.update(0.016);

      expect(enemy.velocityX).toBe(-80);
    });
  });

  describe('stomp detection', () => {
    it('should detect stomp when player is falling from above', () => {
      const enemy = createEnemy();
      const player = new Player({ x: 200, y: 456 }); // just above enemy
      player.velocityY = 100; // falling

      expect(enemy.isStompedBy(player)).toBe(true);
    });

    it('should not detect stomp when player is rising', () => {
      const enemy = createEnemy();
      const player = new Player({ x: 200, y: 456 });
      player.velocityY = -100; // jumping up

      expect(enemy.isStompedBy(player)).toBe(false);
    });

    it('should not detect stomp when player is beside enemy', () => {
      const enemy = createEnemy();
      const player = new Player({ x: 200, y: 504 }); // same level
      player.velocityY = 0;

      expect(enemy.isStompedBy(player)).toBe(false);
    });

    it('should die when stomped', () => {
      const enemy = createEnemy();

      enemy.takeDamage(1);

      expect(enemy.isAlive).toBe(false);
    });
  });
});
