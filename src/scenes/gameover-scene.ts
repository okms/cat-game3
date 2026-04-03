import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/game-config';

export interface GameOverData {
  score: number;
  coins: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverData): void {
    this.cameras.main.setBackgroundColor('#1a0000');

    this.add.text(GAME_WIDTH / 2, 150, 'Game Over', {
      fontSize: '56px',
      color: '#ff4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 260, `Score: ${data.score ?? 0}`, {
      fontSize: '28px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 310, `Coins: ${data.coins ?? 0}`, {
      fontSize: '22px',
      color: '#ffd700',
    }).setOrigin(0.5);

    const restartBtn = this.add.text(GAME_WIDTH / 2, 450, 'Press ENTER to Try Again', {
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: restartBtn,
      alpha: 0.3,
      yoyo: true,
      repeat: -1,
      duration: 800,
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }
}
