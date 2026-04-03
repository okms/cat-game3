import Phaser from 'phaser';
import { SPRITES } from '../config/asset-manifest';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    for (const [key, path] of Object.entries(SPRITES)) {
      this.load.image(key, path);
    }
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}
