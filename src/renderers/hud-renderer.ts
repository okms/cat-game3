import Phaser from 'phaser';
import type { HealthSystem } from '../logic/systems/health-system';
import type { ScoringSystem } from '../logic/systems/scoring-system';

export class HudRenderer {
  private hpBarBg: Phaser.GameObjects.Rectangle;
  private hpBarFill: Phaser.GameObjects.Rectangle;
  private livesText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private coinText: Phaser.GameObjects.Text;
  private powerUpText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.hpBarBg = scene.add.rectangle(20, 20, 200, 20, 0x333333)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.hpBarFill = scene.add.rectangle(20, 20, 200, 20, 0xff0000)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(101);

    this.livesText = scene.add.text(20, 48, '', {
      fontSize: '18px',
      color: '#ffffff',
    }).setScrollFactor(0).setDepth(100);

    this.scoreText = scene.add.text(780, 20, '', {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.coinText = scene.add.text(780, 46, '', {
      fontSize: '16px',
      color: '#ffd700',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.powerUpText = scene.add.text(400, 80, '', {
      fontSize: '20px',
      color: '#00ffff',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
  }

  update(health: HealthSystem, scoring?: ScoringSystem): void {
    const ratio = health.hp / health.maxHP;
    this.hpBarFill.setSize(200 * ratio, 20);

    if (ratio > 0.5) {
      this.hpBarFill.setFillStyle(0x00ff00);
    } else if (ratio > 0.25) {
      this.hpBarFill.setFillStyle(0xffff00);
    } else {
      this.hpBarFill.setFillStyle(0xff0000);
    }

    this.livesText.setText(`Lives: ${health.lives}`);

    if (scoring) {
      this.scoreText.setText(`Score: ${scoring.score}`);
      this.coinText.setText(`Coins: ${scoring.coins}`);

      if (scoring.isPoweredUp) {
        this.powerUpText.setText(`SUPER! ${Math.ceil(scoring.powerUpTimer)}s`);
        this.powerUpText.setVisible(true);
      } else {
        this.powerUpText.setVisible(false);
      }
    }
  }
}
