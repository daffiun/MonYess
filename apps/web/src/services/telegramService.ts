import { supabase } from '@/lib/supabase';
import type { TelegramLinkRecord } from '@/types';

export const telegramService = {
  async getTelegramLink(userId: string): Promise<TelegramLinkRecord | null> {
    const { data, error } = await supabase
      .from('telegram_links')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return (data as unknown as TelegramLinkRecord) || null;
  },

  async createTelegramLinkCode(userId: string, linkCode: string, expiresAt: Date) {
    const { data, error } = await supabase
      .from('telegram_links')
      .insert({
        user_id: userId,
        link_code: linkCode,
        code_expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return (data as unknown as TelegramLinkRecord);
  },

  async deleteTelegramLink(id: string) {
    const { error } = await supabase
      .from('telegram_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  subscribeTelegramLink(userId: string, onUpdate: (payload: any) => void) {
    return supabase
      .channel('telegram_links_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'telegram_links',
          filter: `user_id=eq.${userId}`,
        },
        onUpdate
      )
      .subscribe();
  },

  removeSubscription(channel: any) {
    return supabase.removeChannel(channel);
  },
};
