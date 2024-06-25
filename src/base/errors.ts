/**
 * This error indicates a bug.
 * Do not throw this for invalid user input.
 * Only catch this error to recover gracefully from bugs.
 */
export class BugIndicatingError extends Error {
  constructor(message?: string) {
    super(message || 'An unexpected bug occurred.');
    Object.setPrototypeOf(this, BugIndicatingError.prototype);

    // Because we know for sure only buggy code throws this,
    // we definitely want to break here and fix the bug.
    // eslint-disable-next-line no-debugger
    // debugger;
  }
}
