import { useState, useEffect, useCallback, useRef } from 'react';
import { getMessage, getMessageCount, getMessagesPage, getLatestMessagesInfo } from '../services/messages';
import type { Message } from '../types';

export const useMessages = (limit: number = 20, authorAddress?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Keep the latest values in a ref so the callback identity stays stable.
  const paramsRef = useRef({ limit, authorAddress, page });
  paramsRef.current = { limit, authorAddress, page };

  const fetchMessages = useCallback(async () => {
    const { limit: _limit } = paramsRef.current;
    setLoading(true);
    setError(null);
    try {
      const count = await getMessageCount();
      setTotalCount(count);

      const pageInfo = await getLatestMessagesInfo(_limit);
      setHasMore(pageInfo.hasMore);

      setMessages([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
