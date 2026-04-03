import { describe, it, expect } from 'vitest';
import { PatrolAI } from '@logic/ai/enemy-ai';

describe('PatrolAI', () => {
  it('should move right initially', () => {
    const ai = new PatrolAI({ minX: 100, maxX: 300, speed: 50 });

    expect(ai.getVelocityX()).toBe(50);
  });

  it('should reverse direction when reaching maxX', () => {
    const ai = new PatrolAI({ minX: 100, maxX: 300, speed: 50 });

    ai.update(300);

    expect(ai.getVelocityX()).toBe(-50);
  });

  it('should reverse direction when reaching minX', () => {
    const ai = new PatrolAI({ minX: 100, maxX: 300, speed: 50 });

    // First go right, then manually reverse
    ai.update(300); // reverses to going left
    ai.update(100); // reverses to going right

    expect(ai.getVelocityX()).toBe(50);
  });

  it('should stay within patrol bounds', () => {
    const ai = new PatrolAI({ minX: 100, maxX: 300, speed: 50 });

    // Simulate several position updates
    ai.update(150); // still moving right
    expect(ai.getVelocityX()).toBe(50);

    ai.update(250); // still moving right
    expect(ai.getVelocityX()).toBe(50);

    ai.update(301); // past max, should reverse
    expect(ai.getVelocityX()).toBe(-50);
  });

  it('should report facing direction', () => {
    const ai = new PatrolAI({ minX: 100, maxX: 300, speed: 50 });

    expect(ai.isFacingRight()).toBe(true);

    ai.update(300);
    expect(ai.isFacingRight()).toBe(false);
  });
});
