import { useState, useEffect, useCallback } from 'react';
import { getMessage, getMessageCount, getMessagesPage, getLatestMessagesInfo } from '../services/messages';
import type { Message } from '../types';

export const useMessages = (limit: number = 20, authorAddress?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const count = await getMessageCount();
      setTotalCount(count);

      // Use pagination info to determine what to fetch
      const pageInfo = await getLatestMessagesInfo(limit);
      setHasMore(pageInfo.hasMore);

      // For now, return empty array since we don't have real data yet
      setMessages([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit, authorAddress, page]);

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

  return {
    messages,
    loading,
    error,
    totalCount,
    page,
    hasMore,
    nextPage,
    prevPage,
    refetch: fetchMessages,
  };
};
