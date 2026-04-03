import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config/game-config';
import { BootScene } from './scenes/boot-scene';
import { MenuScene } from './scenes/menu-scene';
import { GameScene } from './scenes/game-scene';
import { GameOverScene } from './scenes/gameover-scene';
import { VictoryScene } from './scenes/victory-scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene, VictoryScene],
};

new Phaser.Game(config);
