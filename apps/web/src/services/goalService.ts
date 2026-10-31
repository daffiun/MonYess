import { supabase } from '@/lib/supabase';
import type { Goal } from '@/types';

export interface CreateGoalDTO {
  name: string;
  target_amount: number;
  current_amount?: number;
  deadline?: string;
  user_id?: string;
}

export interface UpdateGoalDTO {
  name?: string;
  target_amount?: number;
  current_amount?: number;
  deadline?: string;
}

export const goalService = {
  async getGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createGoal(dto: CreateGoalDTO) {
    const { data, error } = await supabase
      .from('goals')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateGoal(id: string, dto: UpdateGoalDTO) {
    const { data, error } = await supabase
      .from('goals')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
