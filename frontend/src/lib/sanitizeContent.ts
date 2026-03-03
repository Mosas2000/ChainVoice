/**
 * @module sanitizeContent
 *
 * Content sanitisation helpers.
 *
 * User-generated text displayed in the feed can contain invisible
 * Unicode characters that disrupt layout or trick users (e.g. RTL
 * override, zero-width joiners used for homograph attacks).  These
 * helpers strip or replace such characters before rendering.
 *
 * @example
 * ```ts
 * import { sanitizeContent } from '@/lib/sanitizeContent';
 *
 * sanitizeContent('hello\u200Bworld');
 * // 'helloworld'
 *
 * sanitizeContent('line1\n\n\n\n\nline2');
 * // 'line1\n\nline2'
 * ```
 */

/**
 * Unicode codepoints that are stripped from message content.
 *
 * - U+200B  Zero-Width Space
 * - U+200C  Zero-Width Non-Joiner
 * - U+200D  Zero-Width Joiner
 * - U+200E  Left-To-Right Mark
 * - U+200F  Right-To-Left Mark
 * - U+202A  Left-To-Right Embedding
 * - U+202B  Right-To-Left Embedding
 * - U+202C  Pop Directional Formatting
 * - U+202D  Left-To-Right Override
 * - U+202E  Right-To-Left Override
 * - U+2066  Left-To-Right Isolate
 * - U+2067  Right-To-Left Isolate
 * - U+2068  First Strong Isolate
 * - U+2069  Pop Directional Isolate
 * - U+FEFF  Byte-Order Mark (when used mid-string)
 */
const INVISIBLE_CHARS_RE =
  /[\u200B\u200C\u200D\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

/**
 * Collapse runs of 3+ consecutive newlines into exactly two, so
 * that users cannot insert huge vertical gaps.
 */
const EXCESSIVE_NEWLINES_RE = /\n{3,}/g;

/**
 * Strip dangerous invisible characters and collapse excessive
 * whitespace so that the text is safe and readable for display.
 *
 * This does NOT alter the on-chain data — only the rendered output.
 */
export function sanitizeContent(text: string): string {
  return text
    .replace(INVISIBLE_CHARS_RE, '')
    .replace(EXCESSIVE_NEWLINES_RE, '\n\n')
    .trim();
}
