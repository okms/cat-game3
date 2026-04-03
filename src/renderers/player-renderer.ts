import Phaser from 'phaser';
import type { Player } from '../logic/entities/player';

export class PlayerRenderer {
  private sprite: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, player: Player) {
    this.sprite = scene.add.image(player.x, player.y, 'cat');
    this.sprite.setOrigin(0, 0);
    this.sprite.setDisplaySize(player.width, player.height);
  }

  update(player: Player): void {
    this.sprite.setPosition(player.x, player.y);
    this.sprite.setFlipX(!player.facingRight);
  }
}
