import Phaser from 'phaser';
import type { Entity } from '../logic/entities/entity';

export interface RenderableEntity extends Entity {
  isAlive: boolean;
  facingRight?: boolean;
}

export class EnemyRenderer {
  private sprite: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, entity: RenderableEntity, textureKey: string = 'boss') {
    this.sprite = scene.add.image(entity.x, entity.y, textureKey);
    this.sprite.setOrigin(0, 0);
    this.sprite.setDisplaySize(entity.width, entity.height);
  }

  update(entity: RenderableEntity): void {
    if (!entity.isAlive) {
      this.sprite.setVisible(false);
      return;
    }
    this.sprite.setPosition(entity.x, entity.y);
    if (entity.facingRight !== undefined) {
      this.sprite.setFlipX(!entity.facingRight);
    }
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
