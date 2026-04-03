import { Entity } from './entity';

export enum CollectibleType {
  Coin = 'coin',
  PowerUp = 'powerup',
}

export interface CollectibleConfig {
  x: number;
  y: number;
  type: CollectibleType;
}

export class Collectible extends Entity {
  readonly type: CollectibleType;
  isCollected: boolean = false;

  constructor(config: CollectibleConfig) {
    super({ x: config.x, y: config.y, width: 32, height: 32 });
    this.type = config.type;
  }

  collect(): boolean {
    if (this.isCollected) return false;
    this.isCollected = true;
    return true;
  }
}
