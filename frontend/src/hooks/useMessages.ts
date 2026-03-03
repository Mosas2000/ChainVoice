import { useState, useEffect, useCallback, useRef } from 'react';
import { getMessage, getMessageCount, getLatestMessagesInfo } from '../services/messages';
import type { Message } from '../types';

export const useMessages = (limit: number = 20, authorAddress?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

  // Keep the latest values in a ref so the callback identity stays stable.
  const paramsRef = useRef({ limit, authorAddress, page });
  paramsRef.current = { limit, authorAddress, page };

  // Track a monotonic fetch ID to discard results from stale requests.
  const fetchIdRef = useRef(0);

  const fetchMessages = useCallback(async () => {
    const id = ++fetchIdRef.current;
    const { limit: _limit } = paramsRef.current;
    const isRefresh = messages.length > 0;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const count = await getMessageCount();
      if (id !== fetchIdRef.current) return;

      setTotalCount(count);

      const pageInfo = await getLatestMessagesInfo(_limit);
      if (id !== fetchIdRef.current) return;

      setHasMore(pageInfo.hasMore);
      setMessages([]);
      setLastFetchedAt(Date.now());
    } catch (err: unknown) {
      if (id !== fetchIdRef.current) return;
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      setError(message);
    } finally {
      if (id === fetchIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage((p) => p + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Re-fetch whenever the consumer changes the pagination or filter params.
  // Because fetchMessages is now stable, we trigger manually here.
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, authorAddress, page]);

  // When the author filter changes, reset back to the first page so
  // we don't end up on an invalid page for the new data set.
  useEffect(() => {
    setPage(0);
  }, [authorAddress]);

  return {
    messages,
    loading,
    refreshing,
    error,
    totalCount,
    lastFetchedAt,
    page,
    hasMore,
    nextPage,
    prevPage,
    refetch: fetchMessages,
  };
};
