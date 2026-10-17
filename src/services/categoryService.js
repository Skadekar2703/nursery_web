// src/services/categoryService.js
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'nursury_categories_store';

// Helper to get fallback categories from local storage or static data
const getLocalCategories = () => {
  return loadFromStorage(STORAGE_KEY, INITIAL_CATEGORIES);
};

const saveLocalCategories = (cats) => {
  saveToStorage(STORAGE_KEY, cats);
};

export const categoryService = {
  /**
   * Fetch all categories
   * @param {Object} options
   * @param {boolean} options.activeOnly
   */
  async getCategories({ activeOnly = false } = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          return { data, error: null, source: 'supabase' };
        }
      } catch (err) {
        console.warn('[categoryService] Supabase fetch failed, falling back to local data:', err.message);
      }
    }

    // Fallback to local data
    let local = getLocalCategories();
    if (activeOnly) {
      local = local.filter((c) => c.is_active !== false);
    }
    return { data: local, error: null, source: 'local' };
  },

  /**
   * Fetch a single category by slug
   */
  async getCategoryBySlug(slug) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (data) return { data, error: null, source: 'supabase' };
      } catch (err) {
        console.warn('[categoryService] Supabase get by slug failed, checking local:', err.message);
      }
    }

    const local = getLocalCategories().find((c) => c.slug === slug || c.id === slug);
    return { data: local || null, error: local ? null : 'Category not found', source: 'local' };
  },

  /**
   * Create a new category (Admin)
   */
  async createCategory(categoryData) {
    const slug =
      categoryData.slug ||
      categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCategory = {
      name: categoryData.name,
      slug,
      description: categoryData.description || '',
      image_url: categoryData.image_url || categoryData.image || '/images/cat_indoor.jpg',
      badge: categoryData.badge || '',
      tagline: categoryData.tagline || '',
      is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
      sort_order: categoryData.sort_order || 0
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([newCategory])
          .select()
          .single();

        if (error) throw error;
        return { data, error: null, source: 'supabase' };
      } catch (err) {
        return { data: null, error: err.message || 'Failed to create category on Supabase' };
      }
    }

    // Local fallback
    const local = getLocalCategories();
    const created = {
      ...newCategory,
      id: `cat-custom-${Date.now()}`,
      count: 0
    };
    saveLocalCategories([...local, created]);
    return { data: created, error: null, source: 'local' };
  },

  /**
   * Update category (Admin)
   */
  async updateCategory(id, updates) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null, source: 'supabase' };
      } catch (err) {
        return { data: null, error: err.message || 'Failed to update category on Supabase' };
      }
    }

    // Local fallback
    const local = getLocalCategories();
    const updated = local.map((cat) => (cat.id === id || cat.slug === id ? { ...cat, ...updates } : cat));
    saveLocalCategories(updated);
    const target = updated.find((cat) => cat.id === id || cat.slug === id);
    return { data: target, error: null, source: 'local' };
  },

  /**
   * Delete category (Admin)
   */
  async deleteCategory(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message || 'Failed to delete category' };
      }
    }

    // Local fallback
    const local = getLocalCategories();
    const filtered = local.filter((cat) => cat.id !== id && cat.slug !== id);
    saveLocalCategories(filtered);
    return { success: true, error: null };
  }
};
