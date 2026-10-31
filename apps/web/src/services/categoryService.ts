import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export interface CreateCategoryDTO {
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  user_id?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  type?: 'income' | 'expense';
  color?: string;
  icon?: string;
}

export const categoryService = {
  async getCategories(type?: 'income' | 'expense'): Promise<Category[]> {
    let query = supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createCategory(dto: CreateCategoryDTO) {
    const { data, error } = await supabase
      .from('categories')
      .insert([dto])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, dto: UpdateCategoryDTO) {
    const { data, error } = await supabase
      .from('categories')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
