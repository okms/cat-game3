export interface TouchDetectionOptions {
  hasTouch: boolean;
  hasKeyboard: boolean;
}

export class TouchDetection {
  private hasTouch: boolean;
  private keyboardDetected: boolean;

  constructor(options: TouchDetectionOptions) {
    this.hasTouch = options.hasTouch;
    this.keyboardDetected = options.hasKeyboard;
  }

  get shouldShowTouchControls(): boolean {
    return this.hasTouch && !this.keyboardDetected;
  }

  onKeyboardDetected(): void {
    this.keyboardDetected = true;
  }

  /** Detect capabilities from the browser environment */
  static fromEnvironment(): TouchDetection {
    const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    return new TouchDetection({ hasTouch, hasKeyboard: false });
  }
}
