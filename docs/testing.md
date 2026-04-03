# Testing

## Approach

**Strict red/green TDD**: every new game logic feature starts with a failing test, then minimal implementation to make it pass.

All tests target `src/logic/` -- pure TypeScript with no Phaser dependency. Tests run fast (~ms) via Vitest.

## Running Tests

```bash
npm test             # Single run
npm run test:watch   # Watch mode (preferred during development)
```

## Test Structure

Tests mirror the `src/logic/` directory:

```
tests/
  entities/
    entity.test.ts        # Base entity: bounds, velocity
    player.test.ts        # Movement, jumping, coyote time, jump buffer, knockback
    enemy.test.ts         # Patrol, stomp detection, damage values
    boss.test.ts          # HP, damage variance, activation, stomp
    collectible.test.ts   # Coin/power-up collection, single-collect
  ai/
    enemy-ai.test.ts      # Patrol bounds, direction reversal
    boss-ai.test.ts       # Activation, jump intervals, phases
  physics/
    physics-world.test.ts # Gravity application, Euler integration
    collision.test.ts     # AABB overlap, side detection, top resolution
  systems/
    health-system.test.ts  # Damage, cooldown, lives, respawn, invulnerability
    scoring-system.test.ts # Coins, enemy/boss defeats, power-up timer
    game-state.test.ts     # State machine transitions
  level/
    level-manager.test.ts  # Level progression, advance, reset
    level-data.test.ts     # Level JSON structure validation
```

## What's Not Tested

Renderers and Phaser scenes are **not** unit-tested. They are thin wrappers that read logic state and draw -- manual play-testing covers them. The logic/renderer split makes this a deliberate tradeoff: all behavior is testable, all drawing is manual-verified.

## Path Aliases

Tests use the same path aliases as the main app:
- `@logic/*` -> `src/logic/*`
- `@config/*` -> `src/config/*`

Configured in `vitest.config.ts` via `resolve.alias`.
