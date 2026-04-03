export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PHYSICS = {
  gravity: 500,
  playerSpeed: 200,
  playerJumpPower: -300,
  playerHP: 100,
  playerLives: 3,
  bossActivationRange: 400,
  enemyDamage: 10,
  bossDamage: 25,
  bossDamageVariance: 0.15,
  damageCooldown: 1,
} as const;
