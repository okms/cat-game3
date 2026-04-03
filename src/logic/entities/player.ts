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
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;

  private static readonly COYOTE_TIME = 0.1;
  private static readonly JUMP_BUFFER_TIME = 0.1;
  private static readonly KNOCKBACK_DURATION = 0.25;

  private knockbackTimer: number = 0;

  constructor(config: { x: number; y: number }) {
    super({ x: config.x, y: config.y, width: 48, height: 48 });
  }

  setInput(input: PlayerInput): void {
    this.input = input;
  }

  applyKnockback(force: number): void {
    this.velocityX = force;
    this.knockbackTimer = Player.KNOCKBACK_DURATION;
  }

  update(dt: number): void {
    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= dt;
    } else {
      this.updateHorizontalMovement();
    }
    this.updateJump(dt);
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

  private updateJump(dt: number): void {
    const jumpPressed = this.input.jump;

    // Track coyote time
    if (this.isGrounded) {
      this.coyoteTimer = Player.COYOTE_TIME;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    // Track jump buffer
    if (jumpPressed && !this.jumpWasPressed) {
      this.jumpBufferTimer = Player.JUMP_BUFFER_TIME;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    const canJump = this.isGrounded || this.coyoteTimer > 0;

    if (canJump && this.jumpBufferTimer > 0) {
      this.velocityY = PHYSICS.playerJumpPower;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
    }

    this.jumpWasPressed = jumpPressed;
  }
}
