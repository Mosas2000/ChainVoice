import { describe, it, expect } from 'vitest';
import { validateStxAddress } from '../frontend/src/lib/validateAddress';

describe('validateStxAddress', () => {
  it('returns an error for an empty string', () => {
    const result = validateStxAddress('');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  it('accepts a valid mainnet address starting with SP', () => {
    const result = validateStxAddress('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('accepts a valid testnet address starting with ST', () => {
    const result = validateStxAddress('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('rejects an Ethereum-style hex address', () => {
    const result = validateStxAddress('0x1234567890abcdef1234567890abcdef12345678');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/SP.*ST/);
  });

  it('rejects a Bitcoin address starting with bc1', () => {
    const result = validateStxAddress('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');
    expect(result.valid).toBe(false);
  });

  it('rejects an address that is too short', () => {
    const result = validateStxAddress('SP1234');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/format/i);
  });

  it('rejects an address containing invalid base-58 characters', () => {
    // 'O' and '0' are not in base-58
    const result = validateStxAddress('SP00000000000000000000000000000000000');
    expect(result.valid).toBe(false);
  });

  it('rejects an address with spaces', () => {
    const result = validateStxAddress('SP 2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');
    expect(result.valid).toBe(false);
  });
});
