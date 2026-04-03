import { Entity } from '../entities/entity';

export enum CollisionSide {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

export function aabbOverlap(a: Entity, b: Entity): boolean {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}

export function detectCollisionSide(mover: Entity, obstacle: Entity): CollisionSide {
  const overlapLeft = mover.right - obstacle.left;
  const overlapRight = obstacle.right - mover.left;
  const overlapTop = mover.bottom - obstacle.top;
  const overlapBottom = obstacle.bottom - mover.top;

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

  if (minOverlap === overlapTop) return CollisionSide.Top;
  if (minOverlap === overlapBottom) return CollisionSide.Bottom;
  if (minOverlap === overlapLeft) return CollisionSide.Left;
  return CollisionSide.Right;
}

export function resolveTopCollision(entity: Entity, platform: Entity): void {
  entity.y = platform.y - entity.height;
  entity.velocityY = 0;
}
