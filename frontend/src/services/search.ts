import type { ProfileSearchResult, SearchParams } from '@/types/search';

/**
 * Maximum number of results returned by a single search call.
 * Keeps the UI responsive on low-powered devices.
 */
const DEFAULT_LIMIT = 20;

/**
 * Search for user profiles by username.
 *
 * Currently returns client-side stub data so the UI can be built
 * and tested end-to-end.  Once a Stacks API or indexer endpoint is
 * available, the implementation will switch to a real network call
 * without changing the public interface.
 *
 * The stub list includes a handful of realistic profiles so the
 * search filtering logic can be exercised visually during development.
 */
export async function searchProfiles(
  params: SearchParams
): Promise<ProfileSearchResult[]> {
  const { query, limit = DEFAULT_LIMIT } = params;

  // Simulated latency so loading states are visible during development
  await new Promise((resolve) => setTimeout(resolve, 350));

  const stubProfiles: ProfileSearchResult[] = [
    {
      address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
      username: 'satoshi',
      bio: 'Decentralisation advocate and builder',
      avatarUrl: '',
      createdAt: Date.now() - 86_400_000 * 30,
    },
    {
      address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
      username: 'alice_stacks',
      bio: 'Building on Stacks since day one',
      avatarUrl: '',
      createdAt: Date.now() - 86_400_000 * 20,
    },
    {
      address: 'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
      username: 'bob_clarity',
      bio: 'Clarity smart-contract enthusiast',
      avatarUrl: '',
      createdAt: Date.now() - 86_400_000 * 15,
    },
    {
      address: 'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S',
      username: 'charlie_dev',
      bio: 'Full-stack Stacks developer',
      avatarUrl: '',
      createdAt: Date.now() - 86_400_000 * 10,
    },
    {
      address: 'SP2C2YFP12AJZB1KD5V2S3RRWK0XSVH7G3PQHG3K7',
      username: 'diana_web3',
      bio: 'Web3 UX researcher and designer',
      avatarUrl: '',
      createdAt: Date.now() - 86_400_000 * 5,
    },
    {
      address: 'SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB',
      username: 'eve_blockchain',
      bio: 'Blockchain educator and speaker',
      avatarUrl: '',
      createdAt: Date.now() - 86_400_000 * 2,
    },
  ];

  if (!query.trim()) {
    return stubProfiles.slice(0, limit);
  }

  const normalised = query.trim().toLowerCase();

  return stubProfiles
    .filter(
      (p) =>
        p.username.toLowerCase().includes(normalised) ||
        p.bio?.toLowerCase().includes(normalised) ||
        p.address.toLowerCase().includes(normalised)
    )
    .slice(0, limit);
}
