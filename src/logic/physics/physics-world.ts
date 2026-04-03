import { Entity } from '../entities/entity';

export interface PhysicsConfig {
  gravity: number;
}

export class PhysicsWorld {
  readonly gravity: number;

  constructor(config: PhysicsConfig) {
    this.gravity = config.gravity;
  }

  applyGravity(entity: Entity, dt: number): void {
    entity.velocityY += this.gravity * dt;
  }

  integrate(entity: Entity, dt: number): void {
    entity.x += entity.velocityX * dt;
    entity.y += entity.velocityY * dt;
  }
}
