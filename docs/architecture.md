# Architecture

## Separation of Concerns

The codebase enforces a strict split between **game logic** and **rendering**:

```
src/logic/   -- Pure TypeScript, zero Phaser imports, fully unit-testable
src/scenes/  -- Phaser scene lifecycle, wires logic to renderers
src/renderers/ -- Phaser drawing code, reads logic state, writes to canvas
```

This means all game behavior (physics, AI, damage, scoring) can be tested in isolation without Phaser or a browser.

## Entity Model

All game objects extend `Entity`, which provides position, dimensions, velocity, and AABB bounds:

```
Entity (x, y, width, height, velocityX, velocityY)
  ├── Player    (input, jumping, coyote time, knockback, grounding)
  ├── Enemy     (hp, damage, patrolAI, stomp detection)
  ├── Boss      (hp, bossAI, activation, stomp detection)
  └── Collectible (type: coin|powerup, isCollected flag)
```

Entities are plain data holders with update methods. They don't know about rendering.

## Physics Pipeline (per frame)

The `GameScene.update(time, dt)` runs this sequence every frame:

1. **Death check** -- if `healthSystem.isDead`, trigger respawn or game over
2. **System updates** -- `healthSystem.update(dt)`, `scoringSystem.update(dt)` (cooldowns, power-up timer)
3. **Player input** -- read `InputHandler`, call `player.setInput()` + `player.update(dt)`
4. **Gravity** -- `physicsWorld.applyGravity(player, dt)` (also boss if alive)
5. **Integration** -- `physicsWorld.integrate(player, dt)` moves position by velocity
6. **Fall check** -- if `player.y > levelHeight`, instant kill
7. **Platform collision** -- for each platform, AABB test + top-side resolution if falling
8. **Enemy update** -- AI patrol + gravity + integration + platform collision
9. **Enemy collision** -- stomp (kill enemy) or damage (hurt player + knockback)
10. **Boss update** -- AI + gravity + integration + platform collision
11. **Boss collision** -- stomp (damage boss) or damage (hurt player + knockback)
12. **Collectible collision** -- AABB test, collect coins/power-ups
13. **Door collision** -- if overlapping door, advance level or victory
14. **Render** -- update all renderers with current entity state
15. **Camera** -- scroll to follow player, clamped to level bounds

## Collision System

Custom AABB (Axis-Aligned Bounding Box) collision:

- `aabbOverlap(a, b)` -- strict inequality check for intersection
- `detectCollisionSide(a, b)` -- calculates minimum overlap on each axis to find collision face
- `resolveTopCollision(entity, platform)` -- snaps entity.y to platform surface, zeroes velocityY
- A 0.5px nudge in resolution prevents grounding flicker with the overlap test

Only **top collisions** are resolved (landing on platforms). No wall sliding or ceiling bonks.

## AI

### PatrolAI
Simple state-less bouncing: move at constant speed, reverse direction at patrol bounds.

### BossAI
Two-phase state machine:
- **Idle**: No movement until player enters 400px range
- **Aggressive**: Signals a jump every 2 seconds; boss applies jump velocity when signaled

## Systems

### HealthSystem
Tracks HP, lives, damage cooldown, and death/game-over state. `takeDamage()` respects cooldown window. `kill()` bypasses cooldown (for fall deaths). `computeKnockback()` calculates directional push force.

### ScoringSystem
Tracks score, coin count, and power-up timer. Power-up grants `isPoweredUp` for 8 seconds (2x boss stomp damage, visual "SUPER!" indicator).

### GameStateMachine
Defines valid transitions between Menu/Playing/Paused/GameOver/Victory. Currently the scene system handles most transitions directly -- the state machine exists for logic-level state tracking.

## Camera

Simple horizontal scroll following the player:
```
scrollX = clamp(player.x - GAME_WIDTH/2, 0, levelWidth - GAME_WIDTH)
```
No vertical scrolling (all levels are 600px tall = viewport height).
