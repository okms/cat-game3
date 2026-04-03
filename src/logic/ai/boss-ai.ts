export enum BossPhase {
  Idle = 'idle',
  Aggressive = 'aggressive',
}

export interface BossAIConfig {
  activationRange: number;
  jumpInterval: number;
  jumpPower: number;
}

export class BossAI {
  isActive: boolean = false;
  shouldJump: boolean = false;
  phase: BossPhase = BossPhase.Idle;
  readonly jumpPower: number;

  private readonly activationRange: number;
  private readonly jumpInterval: number;
  private jumpTimer: number = 0;

  constructor(config: BossAIConfig) {
    this.activationRange = config.activationRange;
    this.jumpInterval = config.jumpInterval;
    this.jumpPower = config.jumpPower;
  }

  update(dt: number, playerX: number, bossX: number): void {
    if (!this.isActive) {
      const distance = bossX - playerX;
      if (distance <= this.activationRange) {
        this.isActive = true;
        this.phase = BossPhase.Aggressive;
      }
    }

    if (!this.isActive) return;

    this.jumpTimer += dt;
    if (this.jumpTimer >= this.jumpInterval) {
      this.shouldJump = true;
      this.jumpTimer = 0;
    }
  }

  consumeJump(): void {
    this.shouldJump = false;
  }
}
