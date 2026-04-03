import Phaser from 'phaser';
import type { Player } from '../logic/entities/player';
import type { HealthSystem } from '../logic/systems/health-system';

export class PlayerRenderer {
  private sprite: Phaser.GameObjects.Image;
  private flashTimer: number = 0;

  constructor(scene: Phaser.Scene, player: Player) {
    this.sprite = scene.add.image(player.x, player.y, 'cat');
    this.sprite.setOrigin(0, 0);
    this.sprite.setDisplaySize(player.width, player.height);
  }

  update(player: Player, health?: HealthSystem): void {
    this.sprite.setPosition(player.x, player.y);
    this.sprite.setFlipX(!player.facingRight);

    if (health?.isInvulnerable) {
      this.flashTimer += 0.15;
      this.sprite.setAlpha(Math.sin(this.flashTimer * Math.PI * 2) > 0 ? 1 : 0.2);
    } else {
      this.flashTimer = 0;
      this.sprite.setAlpha(1);
    }
  }
}
