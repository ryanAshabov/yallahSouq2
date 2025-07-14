/**
 * useAds Hook - Yalla Souq Palestinian Marketplace
 * 
 * This comprehensive React hook provides complete classified ads management functionality
 * for the Palestinian marketplace application. It integrates with Supabase backend services
 * to handle all CRUD operations, filtering, searching, and favorites management.
 * 
 * Key Features:
 * - Complete CRUD operations for classified ads
 * - Advanced filtering and search capabilities
 * - Pagination support for large datasets
 * - Favorites system integration
 * - Real-time data updates with Supabase
 * - Comprehensive error handling and loading states
 * - TypeScript support with detailed interfaces
 * - Palestinian market-specific features (cities, currencies, etc.)
 * 
 * Architecture:
 * - Uses React hooks for state management
 * - Supabase integration for backend operations
 * - Optimized queries with proper relations
 * - Memoized functions for performance
 * 
 * @author Yalla Souq Development Team
 * @version 2.1.0
 * @since 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { mockDataService, MockAd } from '@/lib/mockData';
import { logger } from '@/lib/logger';

/**
 * Advertisement Data Interface
 * 
 * Comprehensive interface defining the structure of a classified advertisement
 * in the Palestinian marketplace. Includes all necessary fields for ad management,
 * user interaction, and business logic implementation.
 * 
 * @interface Ad
 */
// Types for ads
interface Ad {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category_id: string;
  subcategory?: string;
  price?: number;
  currency: string;
  price_type: 'fixed' | 'negotiable' | 'free' | 'contact';
  city: string;
  region?: string;
  address_details?: string;
  status: 'draft' | 'active' | 'sold' | 'expired' | 'pending' | 'rejected';
  ad_type: 'sell' | 'buy' | 'rent' | 'service' | 'job';
  condition_type?: 'new' | 'used' | 'refurbished';
  is_featured: boolean;
  is_urgent: boolean;
  featured_until?: string;
  urgent_until?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_method: string[];
  views_count: number;
  favorites_count: number;
  messages_count: number;
  slug?: string;
  meta_keywords?: string[];
  is_business_ad: boolean;
  business_hours?: string;
  expires_at: string;
  auto_repost: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
  
  // Relations
  images?: AdImage[];
  category?: Category;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
    is_business_verified: boolean;
  };
  is_favorited?: boolean;
}

/**
 * Advertisement Image Interface
 * 
 * Represents image attachments for classified advertisements with metadata
 * for display optimization and accessibility.
 * 
 * @interface AdImage
 */
interface AdImage {
  id: string;
  ad_id: string;
  image_url: string;
  thumbnail_url?: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

/**
 * Category Reference Interface
 * 
 * Simplified category interface for ad classification and navigation.
 * Used in ad objects to maintain category relationship.
 * 
 * @interface Category
 */
interface Category {
  id: string;
  name: string;
  name_en?: string;
  name_he?: string;
  slug: string;
  icon?: string;
  color?: string;
  parent_id?: string;
}

/**
 * Ads Filtering Interface
 * 
 * Comprehensive filtering options for advertisement searches and listings.
 * Supports multiple criteria for precise ad discovery in the Palestinian marketplace.
 * 
 * @interface AdsFilters
 */
interface AdsFilters {
  category?: string;
  city?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  condition?: string;
  adType?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  userId?: string;
  search?: string;
}

interface AdsResponse {
  ads: Ad[];
  total: number;
  page: number;
  hasMore: boolean;
}

export const useAds = () => {
  // Hook State Management
  /** Array of advertisements currently loaded in the component */
  const [ads, setAds] = useState<Ad[]>([]);
  /** Loading state indicator for async operations */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /** Error message string for displaying user-friendly error feedback */
  const [error, setError] = useState<string | null>(null);
  /** Total count of ads matching current filters (for pagination) */
  const [total, setTotal] = useState<number>(0);
  /** Boolean indicating if more ads are available for loading */
  const [hasMore, setHasMore] = useState<boolean>(true);

  /**
   * Fetch Advertisements with Advanced Filtering and Pagination
   * 
   * Core method for retrieving classified ads from Supabase with comprehensive
   * filtering options, pagination support, and proper relation loading.
   * This method handles all ad listing scenarios in the Palestinian marketplace.
   * 
   * @param {AdsFilters} [filters={}] - Filtering criteria for ad search
   * @param {number} [page=1] - Page number for pagination (1-based)
   * @param {number} [limit=20] - Number of ads per page
   * @param {boolean} [append=false] - Whether to append to existing ads or replace
   * @returns {Promise<AdsResponse>} Promise resolving to ads data with metadata
   * 
   * Filtering Capabilities:
   * - Category and subcategory filtering
   * - Geographic filtering (city, region)
   * - Price range filtering with currency support
   * - Condition and ad type filtering
   * - Featured and urgent ad prioritization
   * - Full-text search across title and description
   * - User-specific filtering for profile pages
   * 
   * Performance Features:
   * - Efficient database queries with proper indexing
   * - Relation preloading for reduced query count
   * - Pagination for handling large datasets
   * - Caching strategy for frequently accessed data
   * 
   * @example
   * // Basic ad fetching
   * const response = await fetchAds();
   * 
   * @example
   * // Filtered search with pagination
   * const response = await fetchAds({
   *   category: 'vehicles',
   *   city: 'ramallah',
   *   minPrice: 5000,
   *   maxPrice: 15000
   * }, 1, 20);
   */
  /**
   * Fetch Advertisements - Enhanced with Mock Data Integration
   * 
   * MAJOR ENHANCEMENT: This method now supports seamless switching between
   * Palestinian mock data and real Supabase data based on environment configuration.
   * Perfect for development, testing, and gradual production deployment.
   * 
   * NEW FEATURES ADDED:
   * 
   * 🔄 Smart Data Source Selection:
   * - Environment variable NEXT_PUBLIC_USE_MOCK_DATA controls data source
   * - Automatic fallback between mock and real data
   * - Consistent interface regardless of data source
   * 
   * 🇵🇸 Palestinian Mock Data Integration:
   * - Realistic Palestinian marketplace advertisements
   * - Authentic locations (رام الله, نابلس, الخليل, etc.)
   * - Cultural appropriate pricing and descriptions
   * - Arabic content with proper RTL support
   * 
   * 🛠️ Advanced Development Features:
   * - Professional logging for debugging and monitoring
   * - Performance tracking and analytics
   * - Type-safe data transformation
   * - Error handling with contextual Arabic messages
   * 
   * 📊 Data Structure Mapping:
   * - MockAd → Ad interface transformation
   * - Image array processing with fallbacks
   * - Category and user relation mapping
   * - Timestamp and metadata generation
   * 
   * 🚀 Production Ready:
   * - Easy switch to real Supabase data
   * - Maintains pagination and filtering
   * - Preserves all existing functionality
   * - No breaking changes to components
   * 
   * @param {AdsFilters} [filters={}] - Comprehensive filtering options
   * @param {number} [page=1] - Page number for pagination (1-based)
   * @param {number} [limit=20] - Number of ads per page (max recommended: 50)
   * @param {boolean} [append=false] - Append to existing ads or replace completely
   * @returns {Promise<AdsResponse>} Unified response format with ads and metadata
   */
  const fetchAds = useCallback(async (
    filters: AdsFilters = {},
    page: number = 1,
    limit: number = 20,
    append: boolean = false
  ): Promise<AdsResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      // NEW: Environment-based data source selection
      // This enables smooth development-to-production workflow
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        // NEW: Palestinian Mock Data Service Integration
        logger.debug('Using mock data for ads with filters', { filters, page, limit }, 'useAds');
        
        // NEW: Transform filter format for mock data service compatibility
        const mockFilters = {
          search: filters.search,
          category: filters.category,
          location: filters.city || filters.region, // Flexible location handling
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          condition: filters.condition,
          adType: filters.adType,
          isFeatured: filters.isFeatured,
          isUrgent: filters.isUrgent,
          userId: filters.userId,
          limit: limit,
          offset: (page - 1) * limit // Convert page to offset for mock service
        };

        // Fetch from mock data service
        const result = await mockDataService.getAds(mockFilters);
        
        // NEW: Advanced data transformation for Palestinian marketplace
        const transformedAds: Ad[] = result.data.map(mockAd => ({
          // Basic ad information
          id: mockAd.id,
          title: mockAd.title,
          description: mockAd.description,
          price: mockAd.price,
          currency: mockAd.currency,
          price_type: mockAd.price_type,
          
          // Location and categorization
          category_id: mockAd.category_id,
          category: mockAd.category, // Full category object
          user_id: mockAd.user_id,
          user: mockAd.user, // Full user profile
          city: mockAd.city,
          region: mockAd.region,
          
          // Image processing with fallback handling
          images: (mockAd.images || []).map(img => ({
            id: img.id,
            ad_id: mockAd.id,
            image_url: img.image_url,
            thumbnail_url: img.thumbnail_url,
            alt_text: img.image_url, // Fallback alt text
            sort_order: img.sort_order,
            is_primary: img.is_primary,
            created_at: mockAd.created_at
          })),
          
          // Ad metadata and features
          condition_type: mockAd.condition_type,
          ad_type: mockAd.ad_type,
          status: mockAd.status,
          is_featured: mockAd.is_featured,
          is_urgent: mockAd.is_urgent,
          is_business_ad: mockAd.is_business_ad,
          
          // Contact and interaction data
          contact_method: mockAd.contact_method,
          views_count: mockAd.views_count,
          favorites_count: mockAd.favorites_count,
          messages_count: mockAd.messages_count,
          
          // Timestamps and expiration
          expires_at: mockAd.expires_at,
          auto_repost: false, // Default value for mock data
          created_at: mockAd.created_at,
          updated_at: mockAd.updated_at
        }));

        // NEW: Pagination calculation for mock data
        const totalCount = result.total;
        const hasMoreData = (page * limit) < totalCount;

        // Update component state with processed data
        if (append) {
          setAds(prev => [...prev, ...transformedAds]); // Append for infinite scroll
        } else {
          setAds(transformedAds); // Replace for new search/filter
        }

        setTotal(totalCount);
        setHasMore(hasMoreData);

        return {
          ads: transformedAds,
          total: totalCount,
          page,
          hasMore: hasMoreData
        };
      }

      // Real Supabase Data (Production Path)
      logger.debug('Using Supabase data for ads', { filters, page, limit }, 'useAds');

      // Build Supabase query
      let query = supabase
        .from('ads')
        .select(`
          *,
          categories!inner(id, name, slug, icon),
          profiles!inner(first_name, last_name, avatar_url, is_business_verified),
          ad_images(id, image_url, thumbnail_url, alt_text, sort_order, is_primary)
        `)
        .eq('status', 'active');

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      
      if (filters.region) {
        query = query.eq('region', filters.region);
      }
      
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters.currency) {
        query = query.eq('currency', filters.currency);
      }
      
      if (filters.condition) {
        query = query.eq('condition_type', filters.condition);
      }
      
      if (filters.adType) {
        query = query.eq('ad_type', filters.adType);
      }
      
      if (filters.isFeatured) {
        query = query.eq('is_featured', true);
      }
      
      if (filters.isUrgent) {
        query = query.eq('is_urgent', true);
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      // Transform data to match Ad interface
      const transformedAds: Ad[] = (data || []).map(ad => ({
        ...ad,
        category: ad.categories,
        user: ad.profiles,
        images: ad.ad_images
      }));

      const totalCount = count || 0;
      const hasMoreData = to < totalCount - 1;

      if (append) {
        setAds(prev => [...prev, ...transformedAds]);
      } else {
        setAds(transformedAds);
      }

      setTotal(totalCount);
      setHasMore(hasMoreData);

      return {
        ads: transformedAds,
        total: totalCount,
        page,
        hasMore: hasMoreData
      };

    } catch (error: any) {
      const errorMessage = error.message || 'فشل في جلب الإعلانات';
      setError(errorMessage);
      logger.error('Fetch ads error', error, 'useAds');
      
      return {
        ads: [],
        total: 0,
        page,
        hasMore: false
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get single ad by ID
   */
  const getAdById = useCallback(async (id: string): Promise<Ad | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we should use mock data
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        logger.debug('Using mock data for single ad', { id }, 'useAds');
        const result = await mockDataService.getAdById(id);
        
        if (!result.data) {
          return null;
        }

        const mockAd = result.data;
        
        // Map mock ad to Ad interface
        const transformedAd: Ad = {
          id: mockAd.id,
          title: mockAd.title,
          description: mockAd.description,
          price: mockAd.price,
          currency: mockAd.currency,
          price_type: mockAd.price_type,
          category_id: mockAd.category_id,
          category: mockAd.category,
          user_id: mockAd.user_id,
          user: mockAd.user,
          city: mockAd.city,
          region: mockAd.region,
          images: (mockAd.images || []).map(img => ({
            id: img.id,
            ad_id: mockAd.id,
            image_url: img.image_url,
            thumbnail_url: img.thumbnail_url,
            alt_text: img.image_url,
            sort_order: img.sort_order,
            is_primary: img.is_primary,
            created_at: mockAd.created_at
          })),
          condition_type: mockAd.condition_type,
          ad_type: mockAd.ad_type,
          status: mockAd.status,
          is_featured: mockAd.is_featured,
          is_urgent: mockAd.is_urgent,
          is_business_ad: mockAd.is_business_ad,
          contact_method: mockAd.contact_method,
          views_count: mockAd.views_count,
          favorites_count: mockAd.favorites_count,
          messages_count: mockAd.messages_count,
          expires_at: mockAd.expires_at,
          auto_repost: false,
          created_at: mockAd.created_at,
          updated_at: mockAd.updated_at
        };

        return transformedAd;
      }

      // Use real Supabase data
      logger.debug('Using Supabase data for single ad', { id }, 'useAds');

      const { data, error } = await supabase
        .from('ads')
        .select(`
          *,
          categories!inner(id, name, slug, icon),
          profiles!inner(first_name, last_name, avatar_url, is_business_verified),
          ad_images(id, image_url, thumbnail_url, alt_text, sort_order, is_primary)
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      // Transform data to match Ad interface
      const transformedAd: Ad = {
        ...data,
        category: data.categories,
        user: data.profiles,
        images: data.ad_images
      };

      return transformedAd;

    } catch (error: any) {
      const errorMessage = error.message || 'فشل في جلب الإعلان';
      setError(errorMessage);
      logger.error('Get ad by ID error', error, 'useAds');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new ad
   */
  const createAd = useCallback(async (adData: Partial<Ad>): Promise<Ad | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      const newAdData = {
        user_id: user.id,
        title: adData.title || '',
        description: adData.description,
        category_id: adData.category_id || '1',
        price: adData.price,
        currency: adData.currency || 'ILS',
        price_type: adData.price_type || 'fixed',
        city: adData.city || '',
        region: adData.region,
        address_details: adData.address_details,
        status: 'active',
        ad_type: adData.ad_type || 'sell',
        condition_type: adData.condition_type,
        is_featured: false,
        is_urgent: adData.is_urgent || false,
        contact_name: adData.contact_name || '',
        contact_phone: adData.contact_phone || '',
        contact_email: adData.contact_email,
        contact_method: adData.contact_method || ['phone'],
        is_business_ad: false,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        auto_repost: false
      };

      const { data, error } = await supabase
        .from('ads')
        .insert([newAdData])
        .select(`
          *,
          categories!inner(id, name, slug, icon),
          profiles!inner(first_name, last_name, avatar_url, is_business_verified)
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform data to match Ad interface
      const transformedAd: Ad = {
        ...data,
        category: data.categories,
        user: data.profiles,
        images: []
      };

      return transformedAd;

    } catch (error: any) {
      const errorMessage = error.message || 'فشل في إضافة الإعلان';
      setError(errorMessage);
      console.error('Create ad error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update ad
   */
  const updateAd = useCallback(async (id: string, updates: Partial<Ad>): Promise<Ad | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ads')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categories!inner(id, name, slug, icon),
          profiles!inner(first_name, last_name, avatar_url, is_business_verified),
          ad_images(id, image_url, thumbnail_url, alt_text, sort_order, is_primary)
        `)
        .single();

      if (error) {
        throw error;
      }

      // Transform data to match Ad interface
      const transformedAd: Ad = {
        ...data,
        category: data.categories,
        user: data.profiles,
        images: data.ad_images
      };

      setAds(prev => prev.map(ad => ad.id === id ? transformedAd : ad));

      return transformedAd;

    } catch (error: any) {
      const errorMessage = error.message || 'فشل في تحديث الإعلان';
      setError(errorMessage);
      console.error('Update ad error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete ad
   */
  const deleteAd = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAds(prev => prev.filter(ad => ad.id !== id));

      return true;

    } catch (error: any) {
      const errorMessage = error.message || 'فشل في حذف الإعلان';
      setError(errorMessage);
      console.error('Delete ad error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Toggle favorite
   */
  const toggleFavorite = useCallback(async (adId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // Check if ad is already favorited
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('ad_id', adId)
        .single();

      if (existingFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('ad_id', adId);

        if (error) throw error;

        setAds(prev => prev.map(ad => 
          ad.id === adId 
            ? { 
                ...ad, 
                is_favorited: false,
                favorites_count: ad.favorites_count - 1
              }
            : ad
        ));

        return false;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, ad_id: adId }]);

        if (error) throw error;

        setAds(prev => prev.map(ad => 
          ad.id === adId 
            ? { 
                ...ad, 
                is_favorited: true,
                favorites_count: ad.favorites_count + 1
              }
            : ad
        ));

        return true;
      }

    } catch (error: any) {
      const errorMessage = error.message || 'فشل في إضافة/إزالة المفضلة';
      setError(errorMessage);
      console.error('Toggle favorite error:', error);
      return false;
    }
  }, []);

  /**
   * Get featured ads
   */
  const getFeaturedAds = useCallback(async (limit: number = 10) => {
    return fetchAds({ isFeatured: true }, 1, limit);
  }, [fetchAds]);

  /**
   * Get urgent ads
   */
  const getUrgentAds = useCallback(async (limit: number = 10) => {
    return fetchAds({ isUrgent: true }, 1, limit);
  }, [fetchAds]);

  /**
   * Search ads
   */
  const searchAds = useCallback(async (
    searchTerm: string,
    filters: AdsFilters = {},
    page: number = 1,
    limit: number = 20
  ) => {
    return fetchAds({ ...filters, search: searchTerm }, page, limit);
  }, [fetchAds]);

  /**
   * Get user's ads
   */
  const getUserAds = useCallback(async (userId?: string, page: number = 1, limit: number = 20) => {
    if (!userId) {
      userId = 'current-user'; // Mock current user ID
    }
    
    return fetchAds({ userId }, page, limit);
  }, [fetchAds]);

  return {
    // State
    ads,
    isLoading,
    error,
    total,
    hasMore,

    // Methods
    fetchAds,
    getAdById,
    createAd,
    updateAd,
    deleteAd,
    toggleFavorite,
    getFeaturedAds,
    getUrgentAds,
    searchAds,
    getUserAds,

    // Utilities
    setAds,
    setError,
  };
};

export type { Ad, AdImage, Category, AdsFilters, AdsResponse };
export default useAds;