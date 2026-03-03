/**
 * @module validateUrl
 *
 * URL validation for avatar URL inputs and any future URL fields.
 *
 * The contract stores avatar URLs as `string-ascii 200`, so we enforce
 * printable ASCII only, a 200-char limit, and restrict the protocol to
 * http/https to block `javascript:` and `data:` URI injection.
 *
 * @example
 * ```ts
 * import { validateAvatarUrl } from '@/lib/validateUrl';
 *
 * validateAvatarUrl('https://example.com/avatar.png');
 * // { valid: true, error: null }
 *
 * validateAvatarUrl('javascript:alert(1)');
 * // { valid: false, error: 'Only https:// and http:// URLs are allowed' }
 * ```
 */

import { LIMITS } from '@/config/limits';

/** Protocols that are safe for image and link `src` attributes. */
const ALLOWED_PROTOCOLS = ['https:', 'http:'] as const;

export interface UrlValidation {
  valid: boolean;
  error: string | null;
}

/**
 * Validate that a string is a well-formed URL with an allowed protocol
 * and within the contract length limit for avatar URLs.
 *
 * Rules enforced:
 *  1. Must be parseable by the URL constructor
 *  2. Protocol must be http: or https: (blocks javascript:, data:, etc.)
 *  3. Must not exceed the contract's max avatar URL length
 *  4. Must be printable ASCII only (Clarity string-ascii constraint)
 *
 * Returns `{ valid: true, error: null }` on success, or a human-readable
 * error message explaining why the URL was rejected.
 */
export function validateAvatarUrl(value: string): UrlValidation {
  // Empty is acceptable — the field is optional.
  if (value.length === 0) {
    return { valid: true, error: null };
  }

  if (value.length > LIMITS.avatarUrl.max) {
    return {
      valid: false,
      error: `URL must be ${LIMITS.avatarUrl.max} characters or fewer`,
    };
  }

  // Printable ASCII check (32–126).
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 32 || code > 126) {
      return {
        valid: false,
        error: 'URL must contain only printable ASCII characters',
      };
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { valid: false, error: 'Please enter a valid URL' };
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol as (typeof ALLOWED_PROTOCOLS)[number])) {
    return {
      valid: false,
      error: 'Only https:// and http:// URLs are allowed',
    };
  }

  return { valid: true, error: null };
}

/**
 * Quick boolean check useful in contexts where the detailed error
 * message isn't needed (e.g. disabling a submit button).
 */
export function isValidUrl(value: string): boolean {
  return validateAvatarUrl(value).valid;
}
