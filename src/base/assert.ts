import { BugIndicatingError } from './errors';

export function assert(
  condition: boolean,
  message = 'unexpected state'
): asserts condition {
  if (!condition) {
    throw new BugIndicatingError(`Assertion Failed: ${message}`);
  }
}
