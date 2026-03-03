/**
 * @module validateAddress
 *
 * A lightweight Stacks principal address validator.
 *
 * Standard Stacks addresses start with SP (mainnet) or ST (testnet)
 * followed by a base-58 encoded body.  Contract principals append a
 * dot and the contract name.  This utility validates the format
 * without importing the full @stacks/transactions library.
 *
 * @example
 * ```ts
 * import { validateStxAddress } from '@/lib/validateAddress';
 *
 * const result = validateStxAddress('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');
 * // { valid: true, error: null }
 *
 * const bad = validateStxAddress('0x1234');
 * // { valid: false, error: 'Address must start with SP ...' }
 * ```
 */

/**
 * Regex matching a standard Stacks principal address.
 *
 * Format: SP or ST followed by 28–40 base-58 characters.
 * Base-58 omits 0, O, I, l — hence the character class.
 */
const STANDARD_PRINCIPAL_RE = /^S[TP][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{28,40}$/;

export interface AddressValidation {
  valid: boolean;
  error: string | null;
}

/**
 * Validate a Stacks principal address string.
 *
 * @param value - The address to validate.
 * @returns Validation result with a human-readable error when invalid.
 */
export function validateStxAddress(value: string): AddressValidation {
  if (value.length === 0) {
    return { valid: false, error: 'Address is required' };
  }

  if (!value.startsWith('SP') && !value.startsWith('ST')) {
    return {
      valid: false,
      error: 'Address must start with SP (mainnet) or ST (testnet)',
    };
  }

  if (!STANDARD_PRINCIPAL_RE.test(value)) {
    return {
      valid: false,
      error: 'Invalid address format — check for typos',
    };
  }

  return { valid: true, error: null };
}
