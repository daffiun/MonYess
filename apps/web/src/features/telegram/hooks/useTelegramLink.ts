import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { telegramService } from '@/services/telegramService';
import { generateLinkCode } from '@financebot/shared';
import type { TelegramLinkRecord } from '@/types';

export function useTelegramLink() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [linkData, setLinkData] = useState<TelegramLinkRecord | null>(null);
  const [generating, setGenerating] = useState(false);

  const fetchLinkStatus = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await telegramService.getTelegramLink(user.id);
      setLinkData(data);
    } catch (err: any) {
      console.error('Error fetching telegram link:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLinkStatus();

    if (!user) return;

    const channel = telegramService.subscribeTelegramLink(user.id, (payload) => {
      setLinkData(payload.new);
    });

    return () => {
      telegramService.removeSubscription(channel);
    };
  }, [user, fetchLinkStatus]);

  const handleGenerateCode = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const code = generateLinkCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      if (linkData && !linkData.is_linked) {
        await telegramService.deleteTelegramLink(linkData.id);
      }

      const data = await telegramService.createTelegramLinkCode(user.id, code, expiresAt);
      setLinkData(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleUnlink = async () => {
    if (!linkData) return;
    setGenerating(true);
    try {
      await telegramService.deleteTelegramLink(linkData.id);
      setLinkData(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const isExpired =
    Boolean(linkData?.code_expires_at) &&
    new Date() > new Date(linkData!.code_expires_at!) &&
    !linkData?.is_linked;

  return {
    loading,
    linkData,
    generating,
    isExpired,
    handleGenerateCode,
    handleUnlink,
  };
}
