import Phaser from 'phaser';
import type { PlayerInput } from '../logic/entities/player';

export class InputHandler {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard!.createCursorKeys();
  }

  getPlayerInput(): PlayerInput {
    return {
      left: this.cursors.left.isDown,
      right: this.cursors.right.isDown,
      jump: this.cursors.up.isDown || this.cursors.space.isDown,
    };
  }
}
