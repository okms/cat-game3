import type { LevelData } from './level-data';

export class LevelManager {
  private levels: LevelData[];
  currentLevelIndex: number = 0;

  constructor(levels: LevelData[]) {
    this.levels = levels;
  }

  get currentLevel(): LevelData {
    return this.levels[this.currentLevelIndex];
  }

  get isLastLevel(): boolean {
    return this.currentLevelIndex === this.levels.length - 1;
  }

  get totalLevels(): number {
    return this.levels.length;
  }

  advanceLevel(): boolean {
    if (this.currentLevelIndex >= this.levels.length - 1) {
      return false;
    }
    this.currentLevelIndex++;
    return true;
  }

  reset(): void {
    this.currentLevelIndex = 0;
  }
}
