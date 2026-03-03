import type { Profile } from './index';

/**
 * A profile search result enriches the base Profile type with the
 * owner's Stacks address so the UI can link to and interact with
 * the user beyond just displaying their name.
 */
export interface ProfileSearchResult extends Profile {
  address: string;
}

/**
 * Parameters accepted by the search service.  Using a dedicated
 * type makes it easy to extend with filters later (e.g. sort order,
 * page number) without changing every call site.
 */
export interface SearchParams {
  query: string;
  limit?: number;
}
