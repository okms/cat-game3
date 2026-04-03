export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpawnPoint {
  x: number;
  y: number;
}

export interface EnemySpawn {
  type: 'patrol' | 'boss';
  x: number;
  y: number;
  patrolMinX?: number;
  patrolMaxX?: number;
  bossType?: string;
}

export interface CollectibleSpawn {
  type: 'coin' | 'powerup';
  x: number;
  y: number;
}

export interface LevelData {
  name: string;
  width: number;
  height: number;
  playerSpawn: SpawnPoint;
  platforms: PlatformData[];
  enemies: EnemySpawn[];
  collectibles: CollectibleSpawn[];
  doorPosition: SpawnPoint;
  background?: string;
}
