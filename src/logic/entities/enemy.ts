import { Entity } from './entity';
import { PatrolAI } from '../ai/enemy-ai';
import type { Player } from './player';

export interface EnemyConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  patrolMinX: number;
  patrolMaxX: number;
  speed: number;
  damage: number;
}

export class Enemy extends Entity {
  hp: number = 1;
  isAlive: boolean = true;
  readonly damage: number;
  readonly patrol: PatrolAI;
  facingRight: boolean = true;

  constructor(config: EnemyConfig) {
    super({ x: config.x, y: config.y, width: config.width, height: config.height });
    this.damage = config.damage;
    this.patrol = new PatrolAI({
      minX: config.patrolMinX,
      maxX: config.patrolMaxX,
      speed: config.speed,
    });
  }

  update(_dt: number): void {
    if (!this.isAlive) return;

    this.patrol.update(this.x);
    this.velocityX = this.patrol.getVelocityX();
    this.facingRight = this.patrol.isFacingRight();
  }

  isStompedBy(player: Player): boolean {
    if (player.velocityY <= 0) return false;

    const playerBottom = player.bottom;
    const enemyTop = this.top;
    const stompThreshold = this.height * 0.5;

    return playerBottom <= enemyTop + stompThreshold && playerBottom >= enemyTop;
  }

  takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.isAlive = false;
    }
  }
}
