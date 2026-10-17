// src/services/productService.js
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'nursury_products_store';

// Helper to get fallback/persisted local products
const getLocalProducts = () => {
  return loadFromStorage(STORAGE_KEY, INITIAL_PRODUCTS);
};

const saveLocalProducts = (products) => {
  saveToStorage(STORAGE_KEY, products);
};

// Normalize database product to match existing frontend product shape
export const normalizeProduct = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: Number(item.price),
    originalPrice: item.original_price ? Number(item.original_price) : (item.originalPrice ? Number(item.originalPrice) : undefined),
    image: item.image_url || item.image || '/images/onboarding_plant.jpg',
    imageUrl: item.image_url || item.image || '/images/onboarding_plant.jpg',
    category: item.category_name || item.category || 'Indoor Plants',
    categoryId: item.category_id || item.categoryId || 'indoor-plants',
    stockQuantity: item.stock_quantity !== undefined ? item.stock_quantity : (item.stockQuantity !== undefined ? item.stockQuantity : 15),
    stock_quantity: item.stock_quantity !== undefined ? item.stock_quantity : (item.stockQuantity !== undefined ? item.stockQuantity : 15),
    inStock: (item.stock_quantity !== undefined ? item.stock_quantity > 0 : (item.stockQuantity !== undefined ? item.stockQuantity > 0 : true)),
    isActive: item.is_active !== undefined ? item.is_active : (item.isActive !== undefined ? item.isActive : true),
    is_active: item.is_active !== undefined ? item.is_active : (item.isActive !== undefined ? item.isActive : true),
    plantType: item.plant_type || item.plantType || 'Foliage Plant',
    lightRequirement: item.light_requirement || item.lightRequirement || 'Bright Indirect',
    size: item.size || 'Medium',
    watering: item.watering || 'Once a week',
    tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
    careGuide: item.care_guide || item.careGuide || {},
    rating: item.rating || 4.8,
    reviewsCount: item.reviews_count || item.reviewsCount || 120,
    isFeatured: item.is_featured !== undefined ? item.is_featured : !!item.isFeatured,
    isBestseller: item.is_bestseller !== undefined ? item.is_bestseller : !!item.isBestseller,
    isNewArrival: item.is_new_arrival !== undefined ? item.is_new_arrival : !!item.isNewArrival,
    isBeginnerFriendly: item.is_beginner_friendly !== undefined ? item.is_beginner_friendly : !!item.isBeginnerFriendly,
    isLowLight: item.is_low_light !== undefined ? item.is_low_light : !!item.isLowLight,
    isSeasonal: item.is_seasonal !== undefined ? item.is_seasonal : !!item.isSeasonal,
    createdAt: item.created_at || item.createdAt
  };
};

export const productService = {
  /**
   * Fetch list of products with flexible filters
   */
  async getProducts(params = {}) {
    const {
      activeOnly = true,
      category,
      plantType,
      light,
      size,
      search,
      minPrice,
      maxPrice,
      sortBy = 'recommended'
    } = params;

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('products')
          .select('*, categories(name, slug)');

        if (activeOnly) {
          query = query.eq('is_active', true);
        }

        if (category && category !== 'all') {
          query = query.or(`category_id.eq.${category},slug.eq.${category}`);
        }

        if (plantType && plantType !== 'All Types') {
          query = query.eq('plant_type', plantType);
        }

        if (light && light !== 'All Lighting') {
          query = query.eq('light_requirement', light);
        }

        if (size && size !== 'All Sizes') {
          query = query.eq('size', size);
        }

        if (minPrice !== undefined) {
          query = query.gte('price', minPrice);
        }

        if (maxPrice !== undefined) {
          query = query.lte('price', maxPrice);
        }

        if (search && search.trim()) {
          query = query.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
        }

        if (sortBy === 'price-asc') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-desc') {
          query = query.order('price', { ascending: false });
        } else if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          const mapped = data.map((item) => {
            const catName = item.categories ? item.categories.name : undefined;
            const catSlug = item.categories ? item.categories.slug : undefined;
            return normalizeProduct({
              ...item,
              category_name: catName,
              categoryId: catSlug || item.category_id
            });
          });
          return { data: mapped, error: null, source: 'supabase' };
        }
      } catch (err) {
        console.warn('[productService] Supabase getProducts failed, falling back to local:', err.message);
      }
    }

    // Local fallback
    let list = getLocalProducts().map(normalizeProduct);

    if (activeOnly) {
      list = list.filter((p) => p.is_active !== false);
    }

    if (category && category !== 'all') {
      list = list.filter((p) => p.categoryId === category || p.category === category);
    }

    if (plantType && plantType !== 'All Types') {
      list = list.filter((p) => p.plantType === plantType);
    }

    if (light && light !== 'All Lighting') {
      list = list.filter((p) => p.lightRequirement === light);
    }

    if (size && size !== 'All Sizes') {
      list = list.filter((p) => p.size === size);
    }

    if (maxPrice !== undefined) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    if (minPrice !== undefined) {
      list = list.filter((p) => p.price >= minPrice);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.plantType?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return { data: list, error: null, source: 'local' };
  },

  /**
   * Fetch single product by slug or id
   */
  async getProductBySlug(slug) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();

        if (error) throw error;
        if (data) {
          const catName = data.categories ? data.categories.name : undefined;
          const catSlug = data.categories ? data.categories.slug : undefined;
          return {
            data: normalizeProduct({
              ...data,
              category_name: catName,
              categoryId: catSlug || data.category_id
            }),
            error: null,
            source: 'supabase'
          };
        }
      } catch (err) {
        console.warn('[productService] Supabase getProductBySlug failed:', err.message);
      }
    }

    const localList = getLocalProducts().map(normalizeProduct);
    const item = localList.find((p) => p.slug === slug || p.id === slug);
    return { data: item || null, error: item ? null : 'Product not found', source: 'local' };
  },

  /**
   * Create a new plant product (Admin)
   */
  async createProduct(productData) {
    const slug =
      productData.slug ||
      productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const record = {
      name: productData.name,
      slug,
      description: productData.description || '',
      price: Number(productData.price),
      original_price: productData.originalPrice ? Number(productData.originalPrice) : null,
      stock_quantity: Math.max(0, parseInt(productData.stockQuantity || productData.stock_quantity || 0, 10)),
      is_active: productData.isActive !== undefined ? productData.isActive : (productData.is_active !== undefined ? productData.is_active : true),
      image_url: productData.imageUrl || productData.image || '/images/onboarding_plant.jpg',
      category_id: productData.categoryId || null,
      plant_type: productData.plantType || 'Foliage Plant',
      light_requirement: productData.lightRequirement || 'Bright Indirect',
      size: productData.size || 'Medium',
      watering: productData.watering || 'Once a week',
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      care_guide: productData.careGuide || {},
      is_featured: !!productData.isFeatured,
      is_bestseller: !!productData.isBestseller,
      is_new_arrival: !!productData.isNewArrival,
      is_beginner_friendly: !!productData.isBeginnerFriendly,
      is_low_light: !!productData.isLowLight,
      is_seasonal: !!productData.isSeasonal
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([record])
          .select()
          .single();

        if (error) throw error;
        return { data: normalizeProduct(data), error: null, source: 'supabase' };
      } catch (err) {
        return { data: null, error: err.message || 'Failed to create product on Supabase' };
      }
    }

    // Local fallback
    const local = getLocalProducts();
    const created = normalizeProduct({
      ...record,
      id: `prod-custom-${Date.now()}`,
      category: productData.category || 'Indoor Plants',
      created_at: new Date().toISOString()
    });
    saveLocalProducts([created, ...local]);
    return { data: created, error: null, source: 'local' };
  },

  /**
   * Update an existing plant product (Admin)
   */
  async updateProduct(id, updates) {
    const dbPayload = {};
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.slug !== undefined) dbPayload.slug = updates.slug;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.price !== undefined) dbPayload.price = Number(updates.price);
    if (updates.originalPrice !== undefined) dbPayload.original_price = Number(updates.originalPrice);
    if (updates.stockQuantity !== undefined) dbPayload.stock_quantity = Math.max(0, parseInt(updates.stockQuantity, 10));
    if (updates.stock_quantity !== undefined) dbPayload.stock_quantity = Math.max(0, parseInt(updates.stock_quantity, 10));
    if (updates.isActive !== undefined) dbPayload.is_active = updates.isActive;
    if (updates.is_active !== undefined) dbPayload.is_active = updates.is_active;
    if (updates.imageUrl !== undefined) dbPayload.image_url = updates.imageUrl;
    if (updates.image !== undefined) dbPayload.image_url = updates.image;
    if (updates.categoryId !== undefined) dbPayload.category_id = updates.categoryId;
    if (updates.plantType !== undefined) dbPayload.plant_type = updates.plantType;
    if (updates.lightRequirement !== undefined) dbPayload.light_requirement = updates.lightRequirement;
    if (updates.size !== undefined) dbPayload.size = updates.size;
    if (updates.watering !== undefined) dbPayload.watering = updates.watering;
    if (updates.tags !== undefined) dbPayload.tags = updates.tags;
    if (updates.careGuide !== undefined) dbPayload.care_guide = updates.careGuide;
    if (updates.isFeatured !== undefined) dbPayload.is_featured = updates.isFeatured;
    if (updates.isBestseller !== undefined) dbPayload.is_bestseller = updates.isBestseller;
    if (updates.isNewArrival !== undefined) dbPayload.is_new_arrival = updates.isNewArrival;
    if (updates.isBeginnerFriendly !== undefined) dbPayload.is_beginner_friendly = updates.isBeginnerFriendly;
    if (updates.isLowLight !== undefined) dbPayload.is_low_light = updates.isLowLight;
    if (updates.isSeasonal !== undefined) dbPayload.is_seasonal = updates.isSeasonal;

    dbPayload.updated_at = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update(dbPayload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data: normalizeProduct(data), error: null, source: 'supabase' };
      } catch (err) {
        return { data: null, error: err.message || 'Failed to update product on Supabase' };
      }
    }

    // Local fallback
    const local = getLocalProducts();
    const updated = local.map((p) => {
      if (p.id === id || p.slug === id) {
        return normalizeProduct({ ...p, ...updates, ...dbPayload });
      }
      return p;
    });
    saveLocalProducts(updated);
    const target = updated.find((p) => p.id === id || p.slug === id);
    return { data: target, error: null, source: 'local' };
  },

  /**
   * Delete or deactivate product
   * @param {string} id
   * @param {boolean} softDelete - Defaults to true for preserving order history
   */
  async deleteProduct(id, softDelete = true) {
    if (softDelete) {
      return this.updateProduct(id, { is_active: false, isActive: false });
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message || 'Failed to delete product' };
      }
    }

    // Local fallback
    const local = getLocalProducts();
    const filtered = local.filter((p) => p.id !== id && p.slug !== id);
    saveLocalProducts(filtered);
    return { success: true, error: null };
  },

  /**
   * Quick stock update
   */
  async updateStock(id, newStock) {
    const qty = Math.max(0, parseInt(newStock, 10) || 0);
    return this.updateProduct(id, { stock_quantity: qty, stockQuantity: qty });
  }
};
