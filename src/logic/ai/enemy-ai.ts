export interface PatrolConfig {
  minX: number;
  maxX: number;
  speed: number;
}

export class PatrolAI {
  private readonly minX: number;
  private readonly maxX: number;
  private readonly speed: number;
  private direction: 1 | -1 = 1;

  constructor(config: PatrolConfig) {
    this.minX = config.minX;
    this.maxX = config.maxX;
    this.speed = config.speed;
  }

  update(currentX: number): void {
    if (currentX >= this.maxX) {
      this.direction = -1;
    } else if (currentX <= this.minX) {
      this.direction = 1;
    }
  }

  getVelocityX(): number {
    return this.speed * this.direction;
  }

  isFacingRight(): boolean {
    return this.direction === 1;
  }
}
