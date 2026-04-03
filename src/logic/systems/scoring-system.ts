export class ScoringSystem {
  score: number = 0;
  coins: number = 0;
  isPoweredUp: boolean = false;
  powerUpTimer: number = 0;

  collectCoin(): void {
    this.coins++;
    this.score += 100;
  }

  enemyDefeated(): void {
    this.score += 200;
  }

  bossDefeated(): void {
    this.score += 1000;
  }

  activatePowerUp(duration: number): void {
    this.isPoweredUp = true;
    this.powerUpTimer = duration;
  }

  update(dt: number): void {
    if (this.isPoweredUp) {
      this.powerUpTimer -= dt;
      if (this.powerUpTimer <= 0) {
        this.powerUpTimer = 0;
        this.isPoweredUp = false;
      }
    }
  }
}
