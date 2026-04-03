export interface EntityConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number = 0;
  velocityY: number = 0;

  constructor(config: EntityConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
  }

  get left(): number {
    return this.x;
  }

  get right(): number {
    return this.x + this.width;
  }

  get top(): number {
    return this.y;
  }

  get bottom(): number {
    return this.y + this.height;
  }
}
