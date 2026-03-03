import { describe, it, expect } from 'vitest';
import { validateAvatarUrl, isValidUrl } from '../frontend/src/lib/validateUrl';

describe('validateAvatarUrl', () => {
  it('accepts an empty string as valid (optional field)', () => {
    const result = validateAvatarUrl('');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('accepts a valid https URL', () => {
    const result = validateAvatarUrl('https://example.com/avatar.png');
    expect(result.valid).toBe(true);
  });

  it('accepts a valid http URL', () => {
    const result = validateAvatarUrl('http://cdn.example.org/img.jpg');
    expect(result.valid).toBe(true);
  });

  it('rejects a javascript: URI', () => {
    const result = validateAvatarUrl('javascript:alert(1)');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/https:\/\/ and http:\/\//);
  });

  it('rejects a data: URI', () => {
    const result = validateAvatarUrl('data:image/png;base64,abc');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/https:\/\/ and http:\/\//);
  });

  it('rejects a URL exceeding 200 characters', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(200);
    const result = validateAvatarUrl(longUrl);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/200 characters/);
  });

  it('rejects non-ASCII characters', () => {
    const result = validateAvatarUrl('https://example.com/émoji');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/ASCII/);
  });

  it('rejects an unparseable string', () => {
    const result = validateAvatarUrl('not a url at all');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/valid URL/);
  });

  it('rejects ftp:// protocol', () => {
    const result = validateAvatarUrl('ftp://files.example.com/avatar.png');
    expect(result.valid).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('returns true for a valid URL', () => {
    expect(isValidUrl('https://cdn.example.com/pic.jpg')).toBe(true);
  });

  it('returns false for an invalid URL', () => {
    expect(isValidUrl('javascript:void(0)')).toBe(false);
  });

  it('returns true for an empty string (optional)', () => {
    expect(isValidUrl('')).toBe(true);
  });
});
