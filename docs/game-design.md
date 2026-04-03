# Game Design Document

## Premise

**Tode's Quest** -- A cat named Tode ventures through three worlds to collect the Heartstone. Side-scrolling 2D platformer with stomp-based combat, collectibles, and boss encounters.

## Controls

| Action | Keys |
|--------|------|
| Move left/right | Arrow Left/Right or A/D |
| Jump | Arrow Up, W, or Space |
| Start game | Enter or Space (on menu) |

## Player Mechanics

- **Movement**: 200 px/s horizontal speed
- **Jump**: -450 px/s initial velocity against 900 px/s gravity
- **Coyote time**: 0.1s grace period to jump after leaving a platform edge
- **Jump buffer**: 0.1s -- if jump is pressed just before landing, it fires on contact
- **Knockback**: On taking damage, player is pushed away from the source for 0.25s (input locked)
- **Invulnerability**: 1.5s after taking damage (sprite flashes)
- **Fall death**: Falling below the level kills instantly (costs one life)

## Health & Lives

- **HP**: 100 (resets on respawn)
- **Lives**: 3
- **Respawn**: 800ms delay, then restart current level with HP refilled
- **Game Over**: When all lives are lost

## Enemies

### Patrol Enemies
- 1 HP (one stomp kills)
- Deal 10 damage on contact
- Patrol between two x-coordinates at 80 px/s
- Reverse direction at patrol bounds

### Bosses
- 100 HP
- Deal 25 damage (15% variance, so 21-29 per hit)
- Idle until player enters 400px activation range
- Jump every 2 seconds while active
- Take 10 damage per stomp (20 when player is powered up)
- Appear on levels 2 and 3

## Collectibles

### Coins
- +100 score, +1 to coin counter
- 32x32px, uses cat-coin sprite

### Power-Ups
- 8 seconds of invulnerability (no damage taken)
- 2x stomp damage against bosses during effect
- HUD shows "SUPER! Xs" countdown in cyan

## Scoring

| Event | Points |
|-------|--------|
| Coin collected | +100 |
| Enemy stomped | +200 |
| Boss defeated | +1000 |

## Levels

### Level 1: The Outskirts (2400px wide)
- Introduction level, teaches basic platforming
- 11 platforms, 3 patrol enemies
- 12 coins, 1 power-up
- No boss

### Level 2: The Depths (3200px wide)
- More complex platforming with longer gaps
- 18 platforms, 4 patrol enemies
- 12 coins, 2 power-ups
- Boss: Space Dragon at x=3000

### Level 3: The Heartstone (3600px wide)
- Final level, highest difficulty
- 20 platforms, 5 patrol enemies
- 14 coins, 2 power-ups
- Boss at x=3400
- Exit door leads to victory

## Scene Flow

```
BootScene (asset loading)
    |
MenuScene ("Tode's Quest - A Cat Adventure")
    |
GameScene (Level 1 -> Level 2 -> Level 3)
    |               |
    |          GameOverScene (all lives lost)
    |               |
    |           MenuScene
    |
VictoryScene ("You found the Heartstone!")
    |
MenuScene
```

## HUD Layout

```
[HP Bar 200px]                    [Level X]
Lives: X                          Score: XXXX
                                  Coins: X (gold)
              [SUPER! Xs] (cyan, only when active)
```

- HP bar color: green (>50%), yellow (>25%), red (<=25%)
- All HUD elements are screen-fixed (scrollFactor 0)
