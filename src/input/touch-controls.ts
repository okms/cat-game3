import Phaser from 'phaser';
import type { PlayerInput } from '../logic/entities/player';

const BUTTON_ALPHA = 0.35;
const BUTTON_ALPHA_PRESSED = 0.6;
const BUTTON_SIZE = 64;
const BUTTON_MARGIN = 20;
const JUMP_BUTTON_SIZE = 80;

export class TouchControls {
  private leftBtn!: Phaser.GameObjects.Arc;
  private rightBtn!: Phaser.GameObjects.Arc;
  private jumpBtn!: Phaser.GameObjects.Arc;
  private leftLabel!: Phaser.GameObjects.Text;
  private rightLabel!: Phaser.GameObjects.Text;
  private jumpLabel!: Phaser.GameObjects.Text;

  private leftDown = false;
  private rightDown = false;
  private jumpDown = false;

  private allObjects: Phaser.GameObjects.GameObject[] = [];

  constructor(private scene: Phaser.Scene) {
    this.createButtons();
  }

  private createButtons(): void {
    const cam = this.scene.cameras.main;
    const bottom = cam.height - BUTTON_MARGIN - BUTTON_SIZE;

    // Left button - bottom left
    const leftX = BUTTON_MARGIN + BUTTON_SIZE;
    const leftY = bottom;
    this.leftBtn = this.scene.add.circle(leftX, leftY, BUTTON_SIZE, 0xffffff, BUTTON_ALPHA)
      .setScrollFactor(0).setDepth(1000).setInteractive();
    this.leftLabel = this.scene.add.text(leftX, leftY, '<', {
      fontSize: '36px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setAlpha(0.7);

    // Right button - next to left
    const rightX = leftX + BUTTON_SIZE * 2 + BUTTON_MARGIN;
    const rightY = bottom;
    this.rightBtn = this.scene.add.circle(rightX, rightY, BUTTON_SIZE, 0xffffff, BUTTON_ALPHA)
      .setScrollFactor(0).setDepth(1000).setInteractive();
    this.rightLabel = this.scene.add.text(rightX, rightY, '>', {
      fontSize: '36px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setAlpha(0.7);

    // Jump button - bottom right
    const jumpX = cam.width - BUTTON_MARGIN - JUMP_BUTTON_SIZE;
    const jumpY = bottom;
    this.jumpBtn = this.scene.add.circle(jumpX, jumpY, JUMP_BUTTON_SIZE, 0x44aaff, BUTTON_ALPHA)
      .setScrollFactor(0).setDepth(1000).setInteractive();
    this.jumpLabel = this.scene.add.text(jumpX, jumpY, 'JUMP', {
      fontSize: '20px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setAlpha(0.7);

    this.allObjects = [
      this.leftBtn, this.leftLabel,
      this.rightBtn, this.rightLabel,
      this.jumpBtn, this.jumpLabel,
    ];

    // Wire up touch events
    this.wireButton(this.leftBtn, (down) => { this.leftDown = down; });
    this.wireButton(this.rightBtn, (down) => { this.rightDown = down; });
    this.wireButton(this.jumpBtn, (down) => { this.jumpDown = down; });
  }

  private wireButton(btn: Phaser.GameObjects.Arc, setter: (down: boolean) => void): void {
    btn.on('pointerdown', () => {
      setter(true);
      btn.setAlpha(BUTTON_ALPHA_PRESSED);
    });
    btn.on('pointerup', () => {
      setter(false);
      btn.setAlpha(BUTTON_ALPHA);
    });
    btn.on('pointerout', () => {
      setter(false);
      btn.setAlpha(BUTTON_ALPHA);
    });
  }

  getInput(): PlayerInput {
    return {
      left: this.leftDown,
      right: this.rightDown,
      jump: this.jumpDown,
    };
  }

  setVisible(visible: boolean): void {
    for (const obj of this.allObjects) {
      (obj as unknown as Phaser.GameObjects.Components.Visible).setVisible(visible);
    }
  }

  destroy(): void {
    for (const obj of this.allObjects) {
      obj.destroy();
    }
  }
}
