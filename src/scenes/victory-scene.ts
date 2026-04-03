import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/game-config';

export interface VictoryData {
  score: number;
  coins: number;
}

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create(data: VictoryData): void {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.add.text(GAME_WIDTH / 2, 120, 'Victory!', {
      fontSize: '56px',
      color: '#44ff44',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 200, 'Tode found the Heartstone!', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 260, 'The curse is broken. The world is saved.', {
      fontSize: '18px',
      color: '#cccccc',
    }).setOrigin(0.5);

    this.add.image(GAME_WIDTH / 2, 340, 'cat')
      .setDisplaySize(96, 96);

    this.add.text(GAME_WIDTH / 2, 420, `Final Score: ${data.score ?? 0}`, {
      fontSize: '28px',
      color: '#ffd700',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 460, `Coins Collected: ${data.coins ?? 0}`, {
      fontSize: '20px',
      color: '#ffd700',
    }).setOrigin(0.5);

    const menuBtn = this.add.text(GAME_WIDTH / 2, 540, 'Press ENTER to Play Again', {
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: menuBtn,
      alpha: 0.3,
      yoyo: true,
      repeat: -1,
      duration: 800,
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });
  }
}
