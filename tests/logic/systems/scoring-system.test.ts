import { describe, it, expect } from 'vitest';
import { ScoringSystem } from '@logic/systems/scoring-system';

describe('ScoringSystem', () => {
  it('should start at zero', () => {
    const scoring = new ScoringSystem();

    expect(scoring.score).toBe(0);
    expect(scoring.coins).toBe(0);
  });

  it('should add coins and score when collecting a coin', () => {
    const scoring = new ScoringSystem();

    scoring.collectCoin();

    expect(scoring.coins).toBe(1);
    expect(scoring.score).toBe(100);
  });

  it('should accumulate multiple coins', () => {
    const scoring = new ScoringSystem();

    scoring.collectCoin();
    scoring.collectCoin();
    scoring.collectCoin();

    expect(scoring.coins).toBe(3);
    expect(scoring.score).toBe(300);
  });

  it('should add bonus score for stomping enemy', () => {
    const scoring = new ScoringSystem();

    scoring.enemyDefeated();

    expect(scoring.score).toBe(200);
  });

  it('should add big bonus for defeating boss', () => {
    const scoring = new ScoringSystem();

    scoring.bossDefeated();

    expect(scoring.score).toBe(1000);
  });

  describe('power-up timer', () => {
    it('should not be powered up initially', () => {
      const scoring = new ScoringSystem();

      expect(scoring.isPoweredUp).toBe(false);
    });

    it('should activate power-up for a duration', () => {
      const scoring = new ScoringSystem();

      scoring.activatePowerUp(5);

      expect(scoring.isPoweredUp).toBe(true);
      expect(scoring.powerUpTimer).toBe(5);
    });

    it('should count down power-up timer', () => {
      const scoring = new ScoringSystem();
      scoring.activatePowerUp(5);

      scoring.update(3);

      expect(scoring.isPoweredUp).toBe(true);
      expect(scoring.powerUpTimer).toBeCloseTo(2);
    });

    it('should deactivate when timer expires', () => {
      const scoring = new ScoringSystem();
      scoring.activatePowerUp(5);

      scoring.update(6);

      expect(scoring.isPoweredUp).toBe(false);
      expect(scoring.powerUpTimer).toBe(0);
    });
  });
});
