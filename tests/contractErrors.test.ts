import { describe, it, expect } from 'vitest';
import {
  getContractErrorMessage,
  CONTRACT_ERROR_MESSAGES,
} from '../frontend/src/lib/contractErrors';

describe('getContractErrorMessage', () => {
  it('returns the mapped message for a known numeric code', () => {
    expect(getContractErrorMessage(410)).toBe(CONTRACT_ERROR_MESSAGES[410]);
  });

  it('extracts a code from a string like "u409"', () => {
    expect(getContractErrorMessage('u409')).toBe(CONTRACT_ERROR_MESSAGES[409]);
  });

  it('extracts a code from a Clarity error string "(err u400)"', () => {
    const result = getContractErrorMessage('Contract call returned (err u400)');
    expect(result).toBe(CONTRACT_ERROR_MESSAGES[400]);
  });

  it('extracts a code from an Error object', () => {
    const err = new Error('Transaction failed with error u412');
    expect(getContractErrorMessage(err)).toBe(CONTRACT_ERROR_MESSAGES[412]);
  });

  it('falls back to the Error message when the code is unknown', () => {
    const err = new Error('Something unexpected happened');
    expect(getContractErrorMessage(err)).toBe('Something unexpected happened');
  });

  it('falls back to a raw string when the code is unknown', () => {
    expect(getContractErrorMessage('weird error')).toBe('weird error');
  });

  it('returns the default message for null / undefined', () => {
    expect(getContractErrorMessage(null)).toBe(
      'Something went wrong with the transaction. Please try again.',
    );
    expect(getContractErrorMessage(undefined)).toBe(
      'Something went wrong with the transaction. Please try again.',
    );
  });

  it('maps all codes from profiles.clar', () => {
    expect(CONTRACT_ERROR_MESSAGES[400]).toBeDefined();
    expect(CONTRACT_ERROR_MESSAGES[403]).toBeDefined();
    expect(CONTRACT_ERROR_MESSAGES[404]).toBeDefined();
    expect(CONTRACT_ERROR_MESSAGES[409]).toBeDefined();
    expect(CONTRACT_ERROR_MESSAGES[410]).toBeDefined();
    expect(CONTRACT_ERROR_MESSAGES[411]).toBeDefined();
    expect(CONTRACT_ERROR_MESSAGES[412]).toBeDefined();
  });

  it('maps all codes from chainvoice-batch.clar', () => {
    expect(CONTRACT_ERROR_MESSAGES[401]).toBeDefined();
    expect(CONTRACT_ERROR_MESSAGES[402]).toBeDefined();
  });
});
