import { describe, it, expect } from 'vitest';
import { BossAI, BossPhase } from '@logic/ai/boss-ai';

describe('BossAI', () => {
  function createAI() {
    return new BossAI({ activationRange: 400, jumpInterval: 2, jumpPower: -350 });
  }

  describe('activation', () => {
    it('should start inactive', () => {
      const ai = createAI();

      expect(ai.isActive).toBe(false);
    });

    it('should activate when player is within range', () => {
      const ai = createAI();

      ai.update(0.016, 600, 1000); // playerX=600, bossX=1000, distance=400

      expect(ai.isActive).toBe(true);
    });

    it('should not activate when player is out of range', () => {
      const ai = createAI();

      ai.update(0.016, 100, 1000);

      expect(ai.isActive).toBe(false);
    });

    it('should stay active once activated', () => {
      const ai = createAI();

      ai.update(0.016, 600, 1000); // activate
      ai.update(0.016, 100, 1000); // player moves away

      expect(ai.isActive).toBe(true);
    });
  });

  describe('jumping', () => {
    it('should signal jump after interval when active and grounded', () => {
      const ai = createAI();

      ai.update(0.016, 600, 1000); // activate
      ai.update(2.1, 600, 1000); // wait past interval

      expect(ai.shouldJump).toBe(true);
      expect(ai.jumpPower).toBe(-350);
    });

    it('should not signal jump before interval', () => {
      const ai = createAI();

      ai.update(0.016, 600, 1000); // activate
      ai.update(1.0, 600, 1000); // not enough time

      expect(ai.shouldJump).toBe(false);
    });

    it('should reset jump signal after consuming it', () => {
      const ai = createAI();

      ai.update(0.016, 600, 1000);
      ai.update(2.1, 600, 1000);
      expect(ai.shouldJump).toBe(true);

      ai.consumeJump();
      expect(ai.shouldJump).toBe(false);
    });
  });

  describe('phases', () => {
    it('should start in idle phase', () => {
      const ai = createAI();

      expect(ai.phase).toBe(BossPhase.Idle);
    });

    it('should enter aggressive phase when activated', () => {
      const ai = createAI();

      ai.update(0.016, 600, 1000);

      expect(ai.phase).toBe(BossPhase.Aggressive);
    });
  });
});
