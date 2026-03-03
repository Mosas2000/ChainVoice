import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Validate that the favicon, manifest, and meta-tag configuration
 * is internally consistent and points to files that actually exist
 * in frontend/public/.
 */

const PUBLIC = resolve(__dirname, '../frontend/public');
const INDEX = resolve(__dirname, '../frontend/index.html');

describe('Favicon and icon configuration', () => {
  it('favicon.svg exists in public/', () => {
    expect(existsSync(resolve(PUBLIC, 'favicon.svg'))).toBe(true);
  });

  it('logo.svg exists in public/', () => {
    expect(existsSync(resolve(PUBLIC, 'logo.svg'))).toBe(true);
  });

  it('safari-pinned-tab.svg exists in public/', () => {
    expect(existsSync(resolve(PUBLIC, 'safari-pinned-tab.svg'))).toBe(true);
  });

  it('manifest.json exists in public/', () => {
    expect(existsSync(resolve(PUBLIC, 'manifest.json'))).toBe(true);
  });

  it('robots.txt exists in public/', () => {
    expect(existsSync(resolve(PUBLIC, 'robots.txt'))).toBe(true);
  });

  it('vite.svg has been removed', () => {
    expect(existsSync(resolve(PUBLIC, 'vite.svg'))).toBe(false);
  });
});

describe('index.html link tags', () => {
  const html = readFileSync(INDEX, 'utf-8');

  it('references /favicon.svg as the favicon', () => {
    expect(html).toContain('href="/favicon.svg"');
  });

  it('references the web manifest', () => {
    expect(html).toContain('href="/manifest.json"');
  });

  it('includes apple-touch-icon', () => {
    expect(html).toContain('rel="apple-touch-icon"');
  });

  it('includes the mask-icon for Safari pinned tabs', () => {
    expect(html).toContain('rel="mask-icon"');
    expect(html).toContain('href="/safari-pinned-tab.svg"');
  });

  it('sets a theme-color meta tag', () => {
    expect(html).toContain('name="theme-color"');
    expect(html).toContain('#6D28D9');
  });

  it('does not reference vite.svg', () => {
    expect(html).not.toContain('vite.svg');
  });

  it('includes Open Graph tags', () => {
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:image"');
  });

  it('includes Twitter Card tags', () => {
    expect(html).toContain('name="twitter:card"');
  });
});

describe('manifest.json contents', () => {
  const manifest = JSON.parse(readFileSync(resolve(PUBLIC, 'manifest.json'), 'utf-8'));

  it('has the correct app name', () => {
    expect(manifest.name).toBe('ChainVoice');
  });

  it('declares at least one icon', () => {
    expect(manifest.icons.length).toBeGreaterThanOrEqual(1);
  });

  it('icons reference existing files', () => {
    for (const icon of manifest.icons) {
      const filename = icon.src.replace(/^\//, '');
      expect(existsSync(resolve(PUBLIC, filename))).toBe(true);
    }
  });

  it('sets display to standalone', () => {
    expect(manifest.display).toBe('standalone');
  });

  it('has a theme_color matching the brand', () => {
    expect(manifest.theme_color).toBe('#6D28D9');
  });
});

describe('APP_DETAILS icon path', () => {
  it('contracts config references /logo.svg which exists', () => {
    const config = readFileSync(
      resolve(__dirname, '../frontend/src/config/contracts.ts'),
      'utf-8',
    );
    expect(config).toContain("'/logo.svg'");
    expect(existsSync(resolve(PUBLIC, 'logo.svg'))).toBe(true);
  });
});
