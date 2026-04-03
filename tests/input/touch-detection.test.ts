import { describe, it, expect } from 'vitest';
import { TouchDetection } from '../../src/input/touch-detection';

describe('TouchDetection', () => {
  it('should not show touch controls when no touch support', () => {
    const detection = new TouchDetection({ hasTouch: false, hasKeyboard: false });
    expect(detection.shouldShowTouchControls).toBe(false);
  });

  it('should show touch controls when touch is available and no keyboard', () => {
    const detection = new TouchDetection({ hasTouch: true, hasKeyboard: false });
    expect(detection.shouldShowTouchControls).toBe(true);
  });

  it('should not show touch controls when both touch and keyboard are available', () => {
    const detection = new TouchDetection({ hasTouch: true, hasKeyboard: true });
    expect(detection.shouldShowTouchControls).toBe(false);
  });

  it('should hide touch controls when keyboard is detected later', () => {
    const detection = new TouchDetection({ hasTouch: true, hasKeyboard: false });
    expect(detection.shouldShowTouchControls).toBe(true);

    detection.onKeyboardDetected();
    expect(detection.shouldShowTouchControls).toBe(false);
  });

  it('should not show touch controls when only keyboard is available', () => {
    const detection = new TouchDetection({ hasTouch: false, hasKeyboard: true });
    expect(detection.shouldShowTouchControls).toBe(false);
  });
});
