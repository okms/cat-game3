export interface HealthConfig {
  maxHP: number;
  lives: number;
  damageCooldown: number;
}

export class HealthSystem {
  hp: number;
  readonly maxHP: number;
  lives: number;
  isDead: boolean = false;
  isGameOver: boolean = false;

  private readonly damageCooldown: number;
  private cooldownTimer: number = 0;

  constructor(config: HealthConfig) {
    this.maxHP = config.maxHP;
    this.hp = config.maxHP;
    this.lives = config.lives;
    this.damageCooldown = config.damageCooldown;
  }

  update(dt: number): void {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= dt;
    }
  }

  takeDamage(amount: number): boolean {
    if (this.cooldownTimer > 0) return false;

    this.hp = Math.max(0, this.hp - amount);
    this.cooldownTimer = this.damageCooldown;

    if (this.hp <= 0) {
      this.lives--;
      this.isDead = true;
      if (this.lives <= 0) {
        this.isGameOver = true;
      }
    }

    return true;
  }

  kill(): void {
    this.hp = 0;
    this.lives--;
    this.isDead = true;
    if (this.lives <= 0) {
      this.isGameOver = true;
    }
  }

  respawn(): void {
    this.hp = this.maxHP;
    this.isDead = false;
  }

  get isInvulnerable(): boolean {
    return this.cooldownTimer > 0;
  }

  computeKnockback(entityX: number, sourceX: number, force: number): number {
    if (sourceX > entityX) return -force;
    return force;
  }
}
