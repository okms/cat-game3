import Phaser from 'phaser';
import type { LevelData } from '../logic/level/level-data';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/game-config';

export class LevelRenderer {
  private platformGraphics: Phaser.GameObjects.Image[] = [];
  private door: Phaser.GameObjects.Image;
  private background: Phaser.GameObjects.TileSprite;

  constructor(scene: Phaser.Scene, level: LevelData) {
    this.background = scene.add.tileSprite(0, 0, level.width, GAME_HEIGHT, 'background');
    this.background.setOrigin(0, 0);

    for (const p of level.platforms) {
      const platform = scene.add.image(p.x, p.y, 'platform');
      platform.setOrigin(0, 0);
      platform.setDisplaySize(p.width, p.height);
      this.platformGraphics.push(platform);
    }

    this.door = scene.add.image(level.doorPosition.x, level.doorPosition.y, 'door');
    this.door.setOrigin(0, 0);
    this.door.setDisplaySize(48, 48);
  }

  updateParallax(cameraX: number): void {
    this.background.tilePositionX = cameraX * 0.3;
  }
}
