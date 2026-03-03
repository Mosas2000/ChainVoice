import { describe, it, expect } from 'vitest';
import { sanitizeContent } from '../frontend/src/lib/sanitizeContent';
import { sanitizeImageUrl } from '../frontend/src/lib/sanitizeUrl';

describe('sanitizeContent', () => {
  it('returns plain text unchanged', () => {
    expect(sanitizeContent('hello world')).toBe('hello world');
  });

  it('strips zero-width space characters', () => {
    expect(sanitizeContent('hel\u200Blo')).toBe('hello');
  });

  it('strips zero-width joiner characters', () => {
    expect(sanitizeContent('ab\u200Dcd')).toBe('abcd');
  });

  it('strips RTL override characters', () => {
    expect(sanitizeContent('normal\u202Eoverride')).toBe('normaloverride');
  });

  it('strips left-to-right / right-to-left marks', () => {
    const text = 'start\u200E\u200Fend';
    expect(sanitizeContent(text)).toBe('startend');
  });

  it('strips directional isolate characters', () => {
    const text = 'a\u2066b\u2067c\u2068d\u2069e';
    expect(sanitizeContent(text)).toBe('abcde');
  });

  it('strips byte-order mark in the middle of text', () => {
    expect(sanitizeContent('foo\uFEFFbar')).toBe('foobar');
  });

  it('collapses three or more consecutive newlines into two', () => {
    expect(sanitizeContent('a\n\n\n\nb')).toBe('a\n\nb');
  });

  it('preserves up to two consecutive newlines', () => {
    expect(sanitizeContent('a\n\nb')).toBe('a\n\nb');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeContent('  hello  ')).toBe('hello');
  });

  it('handles a combination of invisible chars and newline runs', () => {
    const evil = '\u200B\u200CHello\n\n\n\nWorld\u202E!';
    expect(sanitizeContent(evil)).toBe('Hello\n\nWorld!');
  });
});

describe('sanitizeImageUrl', () => {
  it('returns a valid https URL unchanged', () => {
    expect(sanitizeImageUrl('https://example.com/pic.png')).toBe('https://example.com/pic.png');
  });

  it('returns a valid http URL unchanged', () => {
    expect(sanitizeImageUrl('http://cdn.example.com/a.jpg')).toBe('http://cdn.example.com/a.jpg');
  });

  it('returns empty string for javascript: URI', () => {
    expect(sanitizeImageUrl('javascript:alert(1)')).toBe('');
  });

  it('returns empty string for data: URI', () => {
    expect(sanitizeImageUrl('data:image/png;base64,abc')).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(sanitizeImageUrl(null)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(sanitizeImageUrl(undefined)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(sanitizeImageUrl('')).toBe('');
  });

  it('trims whitespace before testing', () => {
    expect(sanitizeImageUrl('  https://example.com/x.png  ')).toBe('https://example.com/x.png');
  });

  it('returns empty string for ftp:// protocol', () => {
    expect(sanitizeImageUrl('ftp://files.example.com/avatar.png')).toBe('');
  });
});
