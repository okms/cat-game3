import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/game-config';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.add.text(GAME_WIDTH / 2, 120, "Tode's Quest", {
      fontSize: '48px',
      color: '#ffdd44',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 200, 'A Cat Adventure', {
      fontSize: '20px',
      color: '#cccccc',
    }).setOrigin(0.5);

    this.add.image(GAME_WIDTH / 2, 340, 'cat')
      .setDisplaySize(96, 96);

    const startBtn = this.add.text(GAME_WIDTH / 2, 480, 'Press ENTER or SPACE to Start', {
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startBtn,
      alpha: 0.3,
      yoyo: true,
      repeat: -1,
      duration: 800,
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
