import { Entity } from './entity';
import { PHYSICS } from '../../config/game-config';

export interface PlayerInput {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export class Player extends Entity {
  isGrounded: boolean = true;
  facingRight: boolean = true;

  private input: PlayerInput = { left: false, right: false, jump: false };
  private jumpWasPressed: boolean = false;

  constructor(config: { x: number; y: number }) {
    super({ x: config.x, y: config.y, width: 48, height: 48 });
  }

  setInput(input: PlayerInput): void {
    this.input = input;
  }

  update(_dt: number): void {
    this.updateHorizontalMovement();
    this.updateJump();
  }

  land(surfaceY: number): void {
    this.y = surfaceY - this.height;
    this.velocityY = 0;
    this.isGrounded = true;
  }

  private updateHorizontalMovement(): void {
    if (this.input.left && !this.input.right) {
      this.velocityX = -PHYSICS.playerSpeed;
      this.facingRight = false;
    } else if (this.input.right && !this.input.left) {
      this.velocityX = PHYSICS.playerSpeed;
      this.facingRight = true;
    } else {
      this.velocityX = 0;
    }
  }

  private updateJump(): void {
    const jumpPressed = this.input.jump;

    if (jumpPressed && !this.jumpWasPressed && this.isGrounded) {
      this.velocityY = PHYSICS.playerJumpPower;
      this.isGrounded = false;
    }

    this.jumpWasPressed = jumpPressed;
  }
}
