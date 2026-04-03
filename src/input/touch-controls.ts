import Phaser from 'phaser';
import type { PlayerInput } from '../logic/entities/player';

const BUTTON_ALPHA = 0.35;
const BUTTON_ALPHA_PRESSED = 0.6;
const BUTTON_SIZE = 64;
const BUTTON_MARGIN = 20;
const JUMP_BUTTON_SIZE = 80;

interface ButtonZone {
  x: number;
  y: number;
  radius: number;
  visual: Phaser.GameObjects.Arc;
}

export class TouchControls {
  private leftZone!: ButtonZone;
  private rightZone!: ButtonZone;
  private jumpZone!: ButtonZone;

  private allObjects: Phaser.GameObjects.GameObject[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // Enable multitouch — add 2 extra pointers (Phaser has 1 by default = 3 total)
    scene.input.addPointer(2);
    this.createButtons();
  }

  private createButtons(): void {
    const cam = this.scene.cameras.main;
    const bottom = cam.height - BUTTON_MARGIN - BUTTON_SIZE;

    // Left button - bottom left
    const leftX = BUTTON_MARGIN + BUTTON_SIZE;
    const leftY = bottom;
    const leftBtn = this.scene.add.circle(leftX, leftY, BUTTON_SIZE, 0xffffff, BUTTON_ALPHA)
      .setScrollFactor(0).setDepth(1000);
    const leftLabel = this.scene.add.text(leftX, leftY, '<', {
      fontSize: '36px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setAlpha(0.7);
    this.leftZone = { x: leftX, y: leftY, radius: BUTTON_SIZE, visual: leftBtn };

    // Right button - next to left
    const rightX = leftX + BUTTON_SIZE * 2 + BUTTON_MARGIN;
    const rightY = bottom;
    const rightBtn = this.scene.add.circle(rightX, rightY, BUTTON_SIZE, 0xffffff, BUTTON_ALPHA)
      .setScrollFactor(0).setDepth(1000);
    const rightLabel = this.scene.add.text(rightX, rightY, '>', {
      fontSize: '36px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setAlpha(0.7);
    this.rightZone = { x: rightX, y: rightY, radius: BUTTON_SIZE, visual: rightBtn };

    // Jump button - bottom right
    const jumpX = cam.width - BUTTON_MARGIN - JUMP_BUTTON_SIZE;
    const jumpY = bottom;
    const jumpBtn = this.scene.add.circle(jumpX, jumpY, JUMP_BUTTON_SIZE, 0x44aaff, BUTTON_ALPHA)
      .setScrollFactor(0).setDepth(1000);
    const jumpLabel = this.scene.add.text(jumpX, jumpY, 'JUMP', {
      fontSize: '20px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setAlpha(0.7);
    this.jumpZone = { x: jumpX, y: jumpY, radius: JUMP_BUTTON_SIZE, visual: jumpBtn };

    this.allObjects = [leftBtn, leftLabel, rightBtn, rightLabel, jumpBtn, jumpLabel];
  }

  private isPointerInZone(pointer: Phaser.Input.Pointer, zone: ButtonZone): boolean {
    if (!pointer.isDown) return false;
    const dx = pointer.x - zone.x;
    const dy = pointer.y - zone.y;
    return dx * dx + dy * dy <= zone.radius * zone.radius;
  }

  /** Poll all active pointers to determine which buttons are pressed */
  getInput(): PlayerInput {
    const pointers = [
      this.scene.input.pointer1,
      this.scene.input.pointer2,
      this.scene.input.pointer3,
    ];

    let left = false;
    let right = false;
    let jump = false;

    for (const pointer of pointers) {
      if (!pointer || !pointer.isDown) continue;
      if (this.isPointerInZone(pointer, this.leftZone)) left = true;
      if (this.isPointerInZone(pointer, this.rightZone)) right = true;
      if (this.isPointerInZone(pointer, this.jumpZone)) jump = true;
    }

    // Update visual feedback
    this.leftZone.visual.setAlpha(left ? BUTTON_ALPHA_PRESSED : BUTTON_ALPHA);
    this.rightZone.visual.setAlpha(right ? BUTTON_ALPHA_PRESSED : BUTTON_ALPHA);
    this.jumpZone.visual.setAlpha(jump ? BUTTON_ALPHA_PRESSED : BUTTON_ALPHA);

    return { left, right, jump };
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
