/**
 * Character limits pulled from the Clarity contracts.
 * If the contracts change, update these values to match.
 *
 * profiles.clar:
 *   username  — string-ascii 50   (min 3)
 *   bio       — string-ascii 500
 *   avatar-url — string-ascii 200
 *
 * messages.clar:
 *   content   — string-utf8 500
 *   reaction  — string-ascii 20
 */
export const LIMITS = {
  username: { min: 3, max: 50 },
  bio: { max: 500 },
  avatarUrl: { max: 200 },
  messageContent: { max: 500 },
  reactionType: { max: 20 },
} as const;
