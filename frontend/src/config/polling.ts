/**
 * Application-wide polling and refresh configuration.
 *
 * Centralising these values makes it easy to tune behaviour
 * across the app without hunting through individual components.
 */
export const POLLING = {
  /** How often the feed checks for new messages (ms). */
  feedInterval: 30_000,

  /** How often the profile page re-fetches stats (ms). */
  profileStatsInterval: 60_000,

  /** How long the "last refreshed" label ticks between updates (ms). */
  relativeTimeTick: 15_000,

  /** Distance the user must drag before pull-to-refresh fires (px). */
  pullToRefreshThreshold: 80,
} as const;
