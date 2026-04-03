import Phaser from 'phaser';
import type { PlayerInput } from '../logic/entities/player';
import { TouchDetection } from './touch-detection';
import { TouchControls } from './touch-controls';

export class InputHandler {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private touchDetection: TouchDetection;
  private touchControls: TouchControls | null = null;

  constructor(scene: Phaser.Scene) {
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.touchDetection = TouchDetection.fromEnvironment();

    if (this.touchDetection.shouldShowTouchControls) {
      this.touchControls = new TouchControls(scene);
    }

    // Hide touch controls if a keyboard key is pressed
    scene.input.keyboard!.on('keydown', () => {
      if (this.touchControls && this.touchDetection.shouldShowTouchControls) {
        this.touchDetection.onKeyboardDetected();
        this.touchControls.setVisible(false);
      }
    });
  }

  getPlayerInput(): PlayerInput {
    const keyboard: PlayerInput = {
      left: this.cursors.left.isDown,
      right: this.cursors.right.isDown,
      jump: this.cursors.up.isDown || this.cursors.space.isDown,
    };

    if (this.touchControls && this.touchDetection.shouldShowTouchControls) {
      const touch = this.touchControls.getInput();
      return {
        left: keyboard.left || touch.left,
        right: keyboard.right || touch.right,
        jump: keyboard.jump || touch.jump,
      };
    }

    return keyboard;
  }
}
