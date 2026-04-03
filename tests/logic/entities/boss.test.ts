import { describe, it, expect } from 'vitest';
import { Boss } from '@logic/entities/boss';
import { Player } from '@logic/entities/player';

describe('Boss', () => {
  function createBoss() {
    return new Boss({
      x: 1800, y: 504, width: 64, height: 64,
      hp: 100,
      damage: 25,
      damageVariance: 0.15,
      activationRange: 400,
      jumpInterval: 2,
      jumpPower: -350,
    });
  }

  describe('initialization', () => {
    it('should initialize with HP and position', () => {
      const boss = createBoss();

      expect(boss.x).toBe(1800);
      expect(boss.hp).toBe(100);
      expect(boss.maxHP).toBe(100);
      expect(boss.isAlive).toBe(true);
    });

    it('should start inactive', () => {
      const boss = createBoss();

      expect(boss.isActive).toBe(false);
    });
  });

  describe('damage dealing', () => {
    it('should deal damage within variance range', () => {
      const boss = createBoss();

      for (let i = 0; i < 50; i++) {
        const dmg = boss.rollDamage();
        // Math.round can push values slightly outside the raw range
        expect(dmg).toBeGreaterThanOrEqual(Math.round(25 * 0.85));
        expect(dmg).toBeLessThanOrEqual(Math.round(25 * 1.15));
      }
    });
  });

  describe('taking damage', () => {
    it('should reduce HP when taking damage', () => {
      const boss = createBoss();

      boss.takeDamage(10);

      expect(boss.hp).toBe(90);
    });

    it('should die when HP reaches zero', () => {
      const boss = createBoss();

      boss.takeDamage(100);

      expect(boss.hp).toBe(0);
      expect(boss.isAlive).toBe(false);
    });
  });

  describe('stomp detection', () => {
    it('should detect stomp from above', () => {
      const boss = createBoss();
      // Boss top = 504, player height = 48, so player bottom must be in [504, 504+32]
      const player = new Player({ x: 1800, y: 470 }); // bottom = 470+48 = 518
      player.velocityY = 100;

      expect(boss.isStompedBy(player)).toBe(true);
    });

    it('should not detect stomp from side', () => {
      const boss = createBoss();
      const player = new Player({ x: 1800, y: 504 });
      player.velocityY = 0;

      expect(boss.isStompedBy(player)).toBe(false);
    });
  });

  describe('activation and AI', () => {
    it('should activate when player approaches', () => {
      const boss = createBoss();

      boss.updateAI(0.016, 1400); // playerX within 400 of boss at 1800

      expect(boss.isActive).toBe(true);
    });

    it('should not activate when player is far away', () => {
      const boss = createBoss();

      boss.updateAI(0.016, 100);

      expect(boss.isActive).toBe(false);
    });
  });
});
