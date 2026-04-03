import Phaser from 'phaser';
import { Player } from '../logic/entities/player';
import { Enemy } from '../logic/entities/enemy';
import { Boss } from '../logic/entities/boss';
import { Collectible, CollectibleType } from '../logic/entities/collectible';
import { PhysicsWorld } from '../logic/physics/physics-world';
import { Entity } from '../logic/entities/entity';
import { aabbOverlap, detectCollisionSide, CollisionSide, resolveTopCollision } from '../logic/physics/collision';
import { HealthSystem } from '../logic/systems/health-system';
import { ScoringSystem } from '../logic/systems/scoring-system';
import { LevelManager } from '../logic/level/level-manager';
import { InputHandler } from '../input/input-handler';
import { PlayerRenderer } from '../renderers/player-renderer';
import { EnemyRenderer } from '../renderers/enemy-renderer';
import { LevelRenderer } from '../renderers/level-renderer';
import { HudRenderer } from '../renderers/hud-renderer';
import { PHYSICS, GAME_WIDTH, GAME_HEIGHT } from '../config/game-config';
import type { LevelData } from '../logic/level/level-data';
import level1Data from '../../public/assets/tilemaps/level-1.json';
import level2Data from '../../public/assets/tilemaps/level-2.json';
import level3Data from '../../public/assets/tilemaps/level-3.json';

const ALL_LEVELS = [level1Data, level2Data, level3Data] as LevelData[];

export interface GameSceneData {
  levelManager?: LevelManager;
  healthSystem?: HealthSystem;
  scoringSystem?: ScoringSystem;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies: Enemy[] = [];
  private boss: Boss | null = null;
  private collectibles: Collectible[] = [];
  private physicsWorld!: PhysicsWorld;
  private healthSystem!: HealthSystem;
  private scoringSystem!: ScoringSystem;
  private levelManager!: LevelManager;
  private inputHandler!: InputHandler;
  private playerRenderer!: PlayerRenderer;
  private enemyRenderers: EnemyRenderer[] = [];
  private bossRenderer: EnemyRenderer | null = null;
  private bossHPBar: Phaser.GameObjects.Rectangle | null = null;
  private bossHPFill: Phaser.GameObjects.Rectangle | null = null;
  private collectibleSprites: Phaser.GameObjects.Image[] = [];
  private levelRenderer!: LevelRenderer;
  private hudRenderer!: HudRenderer;
  private platformEntities: Entity[] = [];
  private doorEntity!: Entity;
  private levelComplete: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(data: GameSceneData): void {
    this.levelComplete = false;

    this.levelManager = data.levelManager ?? new LevelManager(ALL_LEVELS);
    this.healthSystem = data.healthSystem ?? new HealthSystem({
      maxHP: PHYSICS.playerHP,
      lives: PHYSICS.playerLives,
      damageCooldown: PHYSICS.damageCooldown,
    });
    this.scoringSystem = data.scoringSystem ?? new ScoringSystem();

    const levelData = this.levelManager.currentLevel;

    this.physicsWorld = new PhysicsWorld({ gravity: PHYSICS.gravity });

    this.player = new Player({
      x: levelData.playerSpawn.x,
      y: levelData.playerSpawn.y,
    });

    this.platformEntities = levelData.platforms.map(
      (p) => new Entity({ x: p.x, y: p.y, width: p.width, height: p.height })
    );

    this.doorEntity = new Entity({
      x: levelData.doorPosition.x,
      y: levelData.doorPosition.y,
      width: 48,
      height: 48,
    });

    // Spawn patrol enemies
    this.enemies = levelData.enemies
      .filter((e) => e.type === 'patrol')
      .map(
        (e) =>
          new Enemy({
            x: e.x, y: e.y, width: 48, height: 48,
            patrolMinX: e.patrolMinX ?? e.x - 100,
            patrolMaxX: e.patrolMaxX ?? e.x + 100,
            speed: 80,
            damage: PHYSICS.bossDamage,
          })
      );

    // Spawn boss if present
    const bossSpawn = levelData.enemies.find((e) => e.type === 'boss');
    this.boss = null;
    if (bossSpawn) {
      this.boss = new Boss({
        x: bossSpawn.x, y: bossSpawn.y, width: 64, height: 64,
        hp: 100,
        damage: PHYSICS.bossDamage,
        damageVariance: PHYSICS.bossDamageVariance,
        activationRange: PHYSICS.bossActivationRange,
        jumpInterval: 2,
        jumpPower: -350,
      });
    }

    // Spawn collectibles
    this.collectibles = levelData.collectibles.map(
      (c) => new Collectible({
        x: c.x, y: c.y,
        type: c.type === 'powerup' ? CollectibleType.PowerUp : CollectibleType.Coin,
      })
    );

    // Renderers
    this.inputHandler = new InputHandler(this);
    this.levelRenderer = new LevelRenderer(this, levelData);
    this.playerRenderer = new PlayerRenderer(this, this.player);
    this.enemyRenderers = this.enemies.map(
      (e) => new EnemyRenderer(this, e, 'boss')
    );

    this.bossRenderer = null;
    this.bossHPBar = null;
    this.bossHPFill = null;
    if (this.boss) {
      const textureKey = bossSpawn?.bossType === 'spacedragon' ? 'spacedragon' : 'boss';
      this.bossRenderer = new EnemyRenderer(this, this.boss, textureKey);
      this.bossHPBar = this.add.rectangle(this.boss.x, this.boss.y - 10, 64, 6, 0x333333).setOrigin(0, 0);
      this.bossHPFill = this.add.rectangle(this.boss.x, this.boss.y - 10, 64, 6, 0xff0000).setOrigin(0, 0);
    }

    this.collectibleSprites = this.collectibles.map((c) => {
      const key = c.type === CollectibleType.Coin ? 'catCoin' : 'catSuper';
      const sprite = this.add.image(c.x, c.y, key);
      sprite.setOrigin(0, 0);
      sprite.setDisplaySize(c.width, c.height);
      return sprite;
    });

    this.hudRenderer = new HudRenderer(this);

    // Level name display
    const levelLabel = this.add.text(GAME_WIDTH / 2, 100, levelData.name, {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setAlpha(1);
    this.tweens.add({
      targets: levelLabel,
      alpha: 0,
      delay: 2000,
      duration: 1000,
    });

    this.cameras.main.setBounds(0, 0, levelData.width, GAME_HEIGHT);
  }

  update(_time: number, delta: number): void {
    if (this.levelComplete) return;

    const dt = delta / 1000;

    if (this.healthSystem.isDead) {
      if (this.healthSystem.isGameOver) {
        this.scene.start('GameOverScene', {
          score: this.scoringSystem.score,
          coins: this.scoringSystem.coins,
        });
        return;
      }
      this.healthSystem.respawn();
      const levelData = this.levelManager.currentLevel;
      this.player.x = levelData.playerSpawn.x;
      this.player.y = levelData.playerSpawn.y;
      this.player.velocityX = 0;
      this.player.velocityY = 0;
      this.player.isGrounded = true;
    }

    this.healthSystem.update(dt);
    this.scoringSystem.update(dt);

    this.player.setInput(this.inputHandler.getPlayerInput());
    this.player.update(dt);

    if (!this.player.isGrounded) {
      this.physicsWorld.applyGravity(this.player, dt);
    }
    this.physicsWorld.integrate(this.player, dt);

    // Platform collision
    this.player.isGrounded = false;
    for (const platform of this.platformEntities) {
      if (aabbOverlap(this.player, platform)) {
        const side = detectCollisionSide(this.player, platform);
        if (side === CollisionSide.Top && this.player.velocityY >= 0) {
          resolveTopCollision(this.player, platform);
          this.player.isGrounded = true;
        }
      }
    }

    // Enemy update and collision
    for (const enemy of this.enemies) {
      if (!enemy.isAlive) continue;

      enemy.update(dt);
      this.physicsWorld.integrate(enemy, dt);

      if (aabbOverlap(this.player, enemy)) {
        if (enemy.isStompedBy(this.player)) {
          enemy.takeDamage(1);
          this.scoringSystem.enemyDefeated();
          this.player.velocityY = PHYSICS.playerJumpPower * 0.5;
        } else {
          const dmg = this.scoringSystem.isPoweredUp ? 0 : enemy.damage;
          if (dmg > 0) {
            const applied = this.healthSystem.takeDamage(dmg);
            if (applied) {
              const kb = this.healthSystem.computeKnockback(this.player.x, enemy.x, 150);
              this.player.velocityX = kb;
            }
          }
        }
      }
    }

    // Boss update and collision
    if (this.boss && this.boss.isAlive) {
      this.boss.updateAI(dt, this.player.x);

      if (!this.boss.isGrounded) {
        this.physicsWorld.applyGravity(this.boss, dt);
      }
      this.physicsWorld.integrate(this.boss, dt);

      this.boss.isGrounded = false;
      for (const platform of this.platformEntities) {
        if (aabbOverlap(this.boss, platform)) {
          const side = detectCollisionSide(this.boss, platform);
          if (side === CollisionSide.Top && this.boss.velocityY >= 0) {
            resolveTopCollision(this.boss, platform);
            this.boss.isGrounded = true;
          }
        }
      }

      if (aabbOverlap(this.player, this.boss)) {
        if (this.boss.isStompedBy(this.player)) {
          const stompDmg = this.scoringSystem.isPoweredUp ? 20 : 10;
          this.boss.takeDamage(stompDmg);
          this.player.velocityY = PHYSICS.playerJumpPower * 0.5;
          if (!this.boss.isAlive) {
            this.scoringSystem.bossDefeated();
          }
        } else {
          const dmg = this.boss.rollDamage();
          const applied = this.healthSystem.takeDamage(dmg);
          if (applied) {
            const kb = this.healthSystem.computeKnockback(this.player.x, this.boss.x, 200);
            this.player.velocityX = kb;
          }
        }
      }
    }

    // Collectible collision
    for (let i = 0; i < this.collectibles.length; i++) {
      const c = this.collectibles[i];
      if (c.isCollected) continue;

      if (aabbOverlap(this.player, c)) {
        if (c.collect()) {
          if (c.type === CollectibleType.Coin) {
            this.scoringSystem.collectCoin();
          } else {
            this.scoringSystem.activatePowerUp(8);
          }
          this.collectibleSprites[i].setVisible(false);
        }
      }
    }

    // Door collision - level transition
    if (aabbOverlap(this.player, this.doorEntity)) {
      this.levelComplete = true;

      if (this.levelManager.isLastLevel) {
        this.scene.start('VictoryScene', {
          score: this.scoringSystem.score,
          coins: this.scoringSystem.coins,
        });
      } else {
        this.levelManager.advanceLevel();
        this.scene.restart({
          levelManager: this.levelManager,
          healthSystem: this.healthSystem,
          scoringSystem: this.scoringSystem,
        } as GameSceneData);
      }
      return;
    }

    // Rendering
    this.playerRenderer.update(this.player);
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemyRenderers[i].update(this.enemies[i]);
    }
    if (this.boss && this.bossRenderer) {
      this.bossRenderer.update(this.boss);
      if (this.bossHPBar && this.bossHPFill) {
        this.bossHPBar.setPosition(this.boss.x, this.boss.y - 10);
        this.bossHPFill.setPosition(this.boss.x, this.boss.y - 10);
        this.bossHPFill.setSize(64 * (this.boss.hp / this.boss.maxHP), 6);
        this.bossHPBar.setVisible(this.boss.isActive && this.boss.isAlive);
        this.bossHPFill.setVisible(this.boss.isActive && this.boss.isAlive);
      }
    }
    this.hudRenderer.update(this.healthSystem, this.scoringSystem);
    this.levelRenderer.updateParallax(this.cameras.main.scrollX);

    this.cameras.main.scrollX = Math.max(
      0,
      Math.min(this.player.x - GAME_WIDTH / 2, this.levelManager.currentLevel.width - GAME_WIDTH)
    );
  }
}
