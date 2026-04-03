import { Entity } from './entity';
import { BossAI } from '../ai/boss-ai';
import type { Player } from './player';

export interface BossConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  damage: number;
  damageVariance: number;
  activationRange: number;
  jumpInterval: number;
  jumpPower: number;
}

export class Boss extends Entity {
  hp: number;
  readonly maxHP: number;
  isAlive: boolean = true;
  isGrounded: boolean = true;
  readonly damage: number;
  readonly damageVariance: number;
  private readonly ai: BossAI;

  constructor(config: BossConfig) {
    super({ x: config.x, y: config.y, width: config.width, height: config.height });
    this.hp = config.hp;
    this.maxHP = config.hp;
    this.damage = config.damage;
    this.damageVariance = config.damageVariance;
    this.ai = new BossAI({
      activationRange: config.activationRange,
      jumpInterval: config.jumpInterval,
      jumpPower: config.jumpPower,
    });
  }

  get isActive(): boolean {
    return this.ai.isActive;
  }

  updateAI(dt: number, playerX: number): void {
    this.ai.update(dt, playerX, this.x);

    if (this.ai.shouldJump) {
      this.velocityY = this.ai.jumpPower;
      this.ai.consumeJump();
    }
  }

  rollDamage(): number {
    const variance = 1 + (Math.random() * 2 - 1) * this.damageVariance;
    return Math.round(this.damage * variance);
  }

  takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.isAlive = false;
    }
  }

  isStompedBy(player: Player): boolean {
    if (player.velocityY <= 0) return false;

    const playerBottom = player.bottom;
    const bossTop = this.top;
    const stompThreshold = this.height * 0.5;

    return playerBottom <= bossTop + stompThreshold && playerBottom >= bossTop;
  }
}
