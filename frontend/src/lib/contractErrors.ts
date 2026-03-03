/**
 * @module contractErrors
 *
 * Human-readable error message mapping for Clarity contract error codes.
 *
 * Each Clarity contract returns numeric error codes wrapped in `(err uN)`.
 * When a contract call fails, the Stacks SDK surfaces these codes inside
 * the error payload.  This module maps every known code to a friendly
 * message that can be shown directly to the user.
 */

/**
 * Maps contract error codes to user-facing descriptions.
 *
 * Codes are sourced from:
 *   - profiles.clar  (u400 – u412)
 *   - messages.clar  (u400, u403, u404)
 *   - chainvoice-batch.clar (u401 – u403)
 */
export const CONTRACT_ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid input — please check your data and try again.',
  401: 'Authentication required — please connect your wallet.',
  402: 'This feature is currently paused. Try again later.',
  403: 'You are not authorised to perform this action.',
  404: 'The requested item was not found.',
  409: 'This action conflicts with existing data (e.g. profile already exists).',
  410: 'That username is already taken — please choose another.',
  411: 'An internal counter overflowed. Please contact support.',
  412: 'You are not following this user.',
};

/**
 * Fallback shown when the error code is not in our lookup table.
 */
const DEFAULT_ERROR_MESSAGE =
  'Something went wrong with the transaction. Please try again.';

/**
 * Given a raw error from a contract call, return a human-readable message.
 *
 * The function tries multiple strategies to extract a numeric code:
 *   1. If `error` is a number, look it up directly.
 *   2. If `error` is a string containing a numeric code pattern, extract it.
 *   3. If `error` is an Error object whose message contains a code, extract it.
 *
 * @param error - The raw error thrown by the SDK or catch block.
 * @returns A user-friendly error string.
 */
export function getContractErrorMessage(error: unknown): string {
  const code = extractErrorCode(error);
  if (code !== null && code in CONTRACT_ERROR_MESSAGES) {
    return CONTRACT_ERROR_MESSAGES[code];
  }

  // If the raw error already has a readable message, forward it.
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  if (typeof error === 'string' && error.length > 0) {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Attempt to pull a numeric Clarity error code from various error shapes.
 */
function extractErrorCode(error: unknown): number | null {
  if (typeof error === 'number') {
    return error;
  }

  const text =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';

  // Match patterns like "u400", "(err u403)", "error code 409", "Error: 410"
  const match = text.match(/\bu?(\d{3})\b/);
  if (match) {
    return parseInt(match[1], 10);
  }

  return null;
}
