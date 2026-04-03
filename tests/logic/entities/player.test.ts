import { describe, it, expect } from 'vitest';
import { Player } from '@logic/entities/player';
import { PHYSICS } from '@config/game-config';

describe('Player', () => {
  function createPlayer() {
    return new Player({ x: 50, y: 300 });
  }

  describe('initialization', () => {
    it('should initialize at given position with default size', () => {
      const player = createPlayer();

      expect(player.x).toBe(50);
      expect(player.y).toBe(300);
      expect(player.width).toBe(48);
      expect(player.height).toBe(48);
    });

    it('should start with zero velocity', () => {
      const player = createPlayer();

      expect(player.velocityX).toBe(0);
      expect(player.velocityY).toBe(0);
    });

    it('should start grounded', () => {
      const player = createPlayer();

      expect(player.isGrounded).toBe(true);
    });

    it('should start facing right', () => {
      const player = createPlayer();

      expect(player.facingRight).toBe(true);
    });
  });

  describe('horizontal movement', () => {
    it('should move right when right input is active', () => {
      const player = createPlayer();

      player.setInput({ left: false, right: true, jump: false });
      player.update(1);

      expect(player.velocityX).toBe(PHYSICS.playerSpeed);
    });

    it('should move left when left input is active', () => {
      const player = createPlayer();

      player.setInput({ left: true, right: false, jump: false });
      player.update(1);

      expect(player.velocityX).toBe(-PHYSICS.playerSpeed);
    });

    it('should stop when no horizontal input', () => {
      const player = createPlayer();

      player.setInput({ left: false, right: false, jump: false });
      player.update(1);

      expect(player.velocityX).toBe(0);
    });

    it('should stop when both left and right are pressed', () => {
      const player = createPlayer();

      player.setInput({ left: true, right: true, jump: false });
      player.update(1);

      expect(player.velocityX).toBe(0);
    });

    it('should face right when moving right', () => {
      const player = createPlayer();

      player.setInput({ left: false, right: true, jump: false });
      player.update(1);

      expect(player.facingRight).toBe(true);
    });

    it('should face left when moving left', () => {
      const player = createPlayer();

      player.setInput({ left: true, right: false, jump: false });
      player.update(1);

      expect(player.facingRight).toBe(false);
    });
  });

  describe('jumping', () => {
    it('should jump when grounded and jump input is active', () => {
      const player = createPlayer();

      player.setInput({ left: false, right: false, jump: true });
      player.update(0.016);

      expect(player.velocityY).toBe(PHYSICS.playerJumpPower);
      expect(player.isGrounded).toBe(false);
    });

    it('should not jump when already in the air', () => {
      const player = createPlayer();
      player.isGrounded = false;
      player.velocityY = 50;

      player.setInput({ left: false, right: false, jump: true });
      player.update(0.016);

      expect(player.velocityY).toBe(50); // unchanged
    });

    it('should not re-trigger jump if jump is held across frames', () => {
      const player = createPlayer();

      player.setInput({ left: false, right: false, jump: true });
      player.update(0.016); // first frame: jumps
      expect(player.velocityY).toBe(PHYSICS.playerJumpPower);

      // Simulate landing
      player.isGrounded = true;
      player.velocityY = 0;

      // Jump is still held - should NOT jump again
      player.update(0.016);
      expect(player.velocityY).toBe(0);
    });

    it('should allow jump again after releasing and pressing jump', () => {
      const player = createPlayer();

      // First jump
      player.setInput({ left: false, right: false, jump: true });
      player.update(0.016);
      expect(player.isGrounded).toBe(false);

      // Land
      player.isGrounded = true;
      player.velocityY = 0;

      // Release jump
      player.setInput({ left: false, right: false, jump: false });
      player.update(0.016);

      // Press jump again
      player.setInput({ left: false, right: false, jump: true });
      player.update(0.016);
      expect(player.velocityY).toBe(PHYSICS.playerJumpPower);
    });
  });

  describe('landing', () => {
    it('should become grounded when land is called', () => {
      const player = createPlayer();
      player.isGrounded = false;
      player.velocityY = 200;

      player.land(300);

      expect(player.isGrounded).toBe(true);
      expect(player.velocityY).toBe(0);
      expect(player.y).toBe(300 - player.height);
    });
  });
});
