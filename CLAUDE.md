# Cat Game 3 - Tode's Quest

A 2D side-scrolling platformer built with TypeScript + Phaser 3 + Vite + Vitest.

Third iteration of the cat-game series:
- [cat-game](https://github.com/okms/cat-game) - Original (vanilla JS, made with ChatGPT by Isabella & Sophia)
- [cat-game2d](https://github.com/okms/cat-game2d) - Second attempt (LOVE2D/Lua)
- [cat-game3](https://github.com/okms/cat-game3) - Current (TypeScript + Phaser 3)

## Quick Start

```bash
npm install
npm run dev          # Dev server at localhost:5173
npm run build        # TypeScript compile + Vite bundle
npm test             # Run all tests
npm run test:watch   # Watch mode for TDD
```

## Development Rules

- **Strict TDD**: Red/green TDD for all game logic. Write a failing test first, then minimal code to pass.
- **No Phaser in logic**: All game logic lives in `src/logic/` with zero Phaser imports, so tests run fast in Vitest.
- **Static levels**: Hand-designed levels (no procedural generation). Level data in `public/assets/levels/`.

## Architecture

```
src/
  main.ts                  # Phaser game bootstrap (800x600, arcade physics)
  config/
    game-config.ts         # Constants: physics, dimensions, tuning values
    asset-manifest.ts      # Sprite paths (SPRITES map)
  input/
    input-handler.ts       # Arrow/WASD + Space/Up input -> PlayerInput
  logic/                   # Pure TS, no framework deps -- fully testable
    entities/
      entity.ts            # Base class: x, y, width, height, velocity, AABB bounds
      player.ts            # Movement, jump (coyote time + buffer), knockback
      enemy.ts             # Patrol enemy (1 HP, stompable)
      boss.ts              # Boss (100 HP, jumps, activation range)
      collectible.ts       # Coin (+100 score) and PowerUp (8s invulnerability)
    ai/
      enemy-ai.ts          # PatrolAI: bounce between minX/maxX
      boss-ai.ts           # BossAI: idle -> aggressive, 2s jump interval
    physics/
      physics-world.ts     # Gravity (900), Euler integration
      collision.ts         # AABB overlap, side detection, top-collision resolution
    level/
      level-data.ts        # LevelData interface + level JSON loader
      level-manager.ts     # 3-level progression, advance/reset
    systems/
      health-system.ts     # HP (100), lives (3), damage cooldown (1.5s), knockback
      scoring-system.ts    # Score, coins, power-up timer, enemy/boss defeat bonuses
      game-state.ts        # State machine (Menu/Playing/Paused/GameOver/Victory)
  scenes/                  # Phaser scenes (rendering + game loop glue)
    boot-scene.ts          # Asset preloading -> MenuScene
    menu-scene.ts          # Title screen, ENTER/SPACE to start
    game-scene.ts          # Main gameplay: entities, physics, collision, rendering
    gameover-scene.ts      # Game over display + restart
    victory-scene.ts       # Win screen after completing all 3 levels
  renderers/               # Phaser drawing code, separate from logic
    player-renderer.ts     # Cat sprite, flip, invulnerability flash
    enemy-renderer.ts      # Enemy/boss sprites, hide on death
    level-renderer.ts      # Background, platforms, door
    hud-renderer.ts        # HP bar, lives, score, coins, power-up timer
tests/                     # ~60 unit tests mirroring src/logic structure
public/assets/
  sprites/                 # PNG sprites (cat, enemy, boss, etc.)
  levels/                  # level-1.json, level-2.json, level-3.json
```

## Key Design Decisions

- **Custom physics** instead of Phaser arcade: minimal gravity + AABB collision with top-only resolution
- **Coyote time (0.1s) + jump buffer (0.1s)**: Makes platforming feel responsive
- **Damage cooldown (1.5s)**: Prevents spam hits, with visible invulnerability flash
- **Knockback (0.25s)**: Forced velocity away from damage source, overrides player input
- **Logic/renderer split**: All game state is pure TS; renderers just read state and draw

## Game Overview

The protagonist is **Tode**, a cat on a quest to collect the Heartstone. Three levels with increasing difficulty, patrol enemies, two boss fights, coins, and power-ups. See [docs/game-design.md](docs/game-design.md) for full details.
