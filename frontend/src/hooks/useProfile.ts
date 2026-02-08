import { useState, useEffect, useCallback } from 'react';
import { getProfile, getUserStats } from '@/services/profiles';
import type { Profile, UserStats } from '@/types';

export function useProfile(userAddress?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userAddress) {
      setProfile(null);
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileData = await getProfile(userAddress);
      setProfile(profileData);

      if (profileData) {
        const statsData = await getUserStats(userAddress);
        setStats(statsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    stats,
    loading,
    error,
    refetch: fetchProfile,
  };
}
