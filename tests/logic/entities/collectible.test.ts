import { describe, it, expect } from 'vitest';
import { Collectible, CollectibleType } from '@logic/entities/collectible';

describe('Collectible', () => {
  it('should initialize as a coin', () => {
    const coin = new Collectible({ x: 100, y: 200, type: CollectibleType.Coin });

    expect(coin.type).toBe(CollectibleType.Coin);
    expect(coin.isCollected).toBe(false);
    expect(coin.width).toBe(32);
    expect(coin.height).toBe(32);
  });

  it('should initialize as a power-up', () => {
    const powerup = new Collectible({ x: 100, y: 200, type: CollectibleType.PowerUp });

    expect(powerup.type).toBe(CollectibleType.PowerUp);
    expect(powerup.isCollected).toBe(false);
  });

  it('should become collected when collected', () => {
    const coin = new Collectible({ x: 100, y: 200, type: CollectibleType.Coin });

    coin.collect();

    expect(coin.isCollected).toBe(true);
  });

  it('should not collect twice', () => {
    const coin = new Collectible({ x: 100, y: 200, type: CollectibleType.Coin });

    expect(coin.collect()).toBe(true);
    expect(coin.collect()).toBe(false);
  });
});
