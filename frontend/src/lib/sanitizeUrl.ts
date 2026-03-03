/**
 * Sanitise a URL string before it is used in DOM attributes such as
 * `<img src>`.  This provides a defence-in-depth layer on top of the
 * input validation in `validateUrl.ts`.  Even if a dangerous URL
 * slipped past form validation (e.g. it was stored on-chain before
 * the validation existed), this function ensures it can never reach
 * the DOM as a javascript: or data: URI.
 */

const SAFE_PROTOCOL_RE = /^https?:\/\//i;

/**
 * Return the URL unchanged if it starts with http:// or https://,
 * otherwise return an empty string so the browser will not attempt
 * to evaluate it.
 */
export function sanitizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  const trimmed = url.trim();
  if (trimmed.length === 0) return '';

  return SAFE_PROTOCOL_RE.test(trimmed) ? trimmed : '';
}
