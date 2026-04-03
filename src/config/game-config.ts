export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PHYSICS = {
  gravity: 900,
  playerSpeed: 200,
  playerJumpPower: -450,
  playerHP: 100,
  playerLives: 3,
  bossActivationRange: 400,
  enemyDamage: 10,
  bossDamage: 25,
  bossDamageVariance: 0.15,
  damageCooldown: 1.5,
} as const;
