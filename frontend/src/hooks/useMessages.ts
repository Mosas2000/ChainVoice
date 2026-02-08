import { useState, useEffect, useCallback } from 'react';
import { getMessage, getMessageCount } from '../services/messages';
import type { Message } from '../types';

export const useMessages = (limit: number = 20, authorAddress?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const count = await getMessageCount();
      setTotalCount(count);

      // For now, return empty array since we don't have real data yet
      setMessages([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit, authorAddress]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, totalCount, refetch: fetchMessages };
};
