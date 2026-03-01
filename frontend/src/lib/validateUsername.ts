import { LIMITS } from '@/config/limits';

/**
 * Allowed characters for a Clarity string-ascii username.
 * Lowercase letters, digits, underscores, and hyphens keep things
 * URL-friendly and match common social-platform conventions.
 */
const USERNAME_PATTERN = /^[a-z0-9_-]+$/;

/** Returns true when every character is in the printable ASCII range (32–126). */
function isAscii(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 32 || code > 126) return false;
  }
  return true;
}

export interface UsernameValidation {
  valid: boolean;
  error: string | null;
}

/**
 * Validate a username against the contract rules and UX conventions.
 *
 *  - Must be ASCII only (string-ascii in Clarity)
 *  - 3–50 characters
 *  - Lowercase alphanumeric, underscores, hyphens only
 *  - Cannot start or end with a hyphen or underscore
 */
export function validateUsername(value: string): UsernameValidation {
  if (value.length === 0) {
    return { valid: false, error: null }; // empty is not an error yet
  }

  if (value.length < LIMITS.username.min) {
    return {
      valid: false,
      error: `Username must be at least ${LIMITS.username.min} characters`,
    };
  }

  if (value.length > LIMITS.username.max) {
    return {
      valid: false,
      error: `Username must be ${LIMITS.username.max} characters or fewer`,
    };
  }

  if (!isAscii(value)) {
    return {
      valid: false,
      error: 'Username must contain only ASCII characters',
    };
  }

  if (value !== value.toLowerCase()) {
    return { valid: false, error: 'Username must be lowercase' };
  }

  if (!USERNAME_PATTERN.test(value)) {
    return {
      valid: false,
      error: 'Only letters, numbers, underscores, and hyphens are allowed',
    };
  }

  if (/^[-_]|[-_]$/.test(value)) {
    return {
      valid: false,
      error: 'Username cannot start or end with a hyphen or underscore',
    };
  }

  return { valid: true, error: null };
}
