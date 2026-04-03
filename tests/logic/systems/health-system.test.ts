import { describe, it, expect } from 'vitest';
import { HealthSystem } from '@logic/systems/health-system';

describe('HealthSystem', () => {
  function createSystem() {
    return new HealthSystem({ maxHP: 100, lives: 3, damageCooldown: 1 });
  }

  describe('initialization', () => {
    it('should start at full HP with all lives', () => {
      const hs = createSystem();

      expect(hs.hp).toBe(100);
      expect(hs.maxHP).toBe(100);
      expect(hs.lives).toBe(3);
      expect(hs.isDead).toBe(false);
      expect(hs.isGameOver).toBe(false);
    });
  });

  describe('taking damage', () => {
    it('should reduce HP by damage amount', () => {
      const hs = createSystem();

      hs.takeDamage(25);

      expect(hs.hp).toBe(75);
    });

    it('should not reduce HP below zero', () => {
      const hs = createSystem();

      hs.takeDamage(150);

      expect(hs.hp).toBe(0);
    });

    it('should ignore damage during cooldown', () => {
      const hs = createSystem();

      hs.takeDamage(25);
      expect(hs.hp).toBe(75);

      hs.takeDamage(25); // should be blocked by cooldown
      expect(hs.hp).toBe(75);
    });

    it('should allow damage after cooldown expires', () => {
      const hs = createSystem();

      hs.takeDamage(25);
      expect(hs.hp).toBe(75);

      hs.update(1.1); // cooldown is 1 second

      hs.takeDamage(25);
      expect(hs.hp).toBe(50);
    });

    it('should return true when damage was applied', () => {
      const hs = createSystem();

      expect(hs.takeDamage(25)).toBe(true);
    });

    it('should return false when damage was blocked by cooldown', () => {
      const hs = createSystem();

      hs.takeDamage(25);
      expect(hs.takeDamage(25)).toBe(false);
    });
  });

  describe('lives and death', () => {
    it('should lose a life when HP reaches zero', () => {
      const hs = createSystem();

      hs.takeDamage(100);

      expect(hs.lives).toBe(2);
      expect(hs.isDead).toBe(true);
    });

    it('should reset HP to max after losing a life', () => {
      const hs = createSystem();

      hs.takeDamage(100);
      hs.respawn();

      expect(hs.hp).toBe(100);
      expect(hs.isDead).toBe(false);
    });

    it('should instantly kill the player bypassing cooldown', () => {
      const hs = createSystem();

      hs.takeDamage(10); // start cooldown
      hs.kill(); // should bypass cooldown

      expect(hs.isDead).toBe(true);
      expect(hs.lives).toBe(2);
      expect(hs.hp).toBe(0);
    });

    it('should trigger game over when kill exhausts last life', () => {
      const hs = createSystem();

      hs.kill(); // life 3 -> 2
      hs.respawn();
      hs.kill(); // life 2 -> 1
      hs.respawn();
      hs.kill(); // life 1 -> 0

      expect(hs.isGameOver).toBe(true);
    });

    it('should be game over when losing last life', () => {
      const hs = createSystem();

      hs.takeDamage(100); // life 3 -> 2
      hs.respawn();
      hs.update(1.1);

      hs.takeDamage(100); // life 2 -> 1
      hs.respawn();
      hs.update(1.1);

      hs.takeDamage(100); // life 1 -> 0

      expect(hs.lives).toBe(0);
      expect(hs.isGameOver).toBe(true);
    });
  });

  describe('invulnerability', () => {
    it('should be invulnerable during damage cooldown', () => {
      const hs = createSystem();

      hs.takeDamage(10);

      expect(hs.isInvulnerable).toBe(true);
    });

    it('should not be invulnerable when cooldown expires', () => {
      const hs = createSystem();

      hs.takeDamage(10);
      hs.update(1.1);

      expect(hs.isInvulnerable).toBe(false);
    });

    it('should not be invulnerable initially', () => {
      const hs = createSystem();

      expect(hs.isInvulnerable).toBe(false);
    });
  });

  describe('knockback', () => {
    it('should compute knockback direction away from damage source', () => {
      const hs = createSystem();

      // Player at x=100, enemy at x=120 -> knockback should be negative (push left)
      const kb = hs.computeKnockback(100, 120, 150);
      expect(kb).toBe(-150);
    });

    it('should push right when damage source is to the left', () => {
      const hs = createSystem();

      const kb = hs.computeKnockback(100, 80, 150);
      expect(kb).toBe(150);
    });

    it('should push right by default when at same position', () => {
      const hs = createSystem();

      const kb = hs.computeKnockback(100, 100, 150);
      expect(kb).toBe(150);
    });
  });
});
