/**
 * useCategories Hook - Yalla Souq Palestinian Marketplace
 * 
 * This custom React hook provides comprehensive category management functionality
 * for the Palestinian marketplace application. It handles fetching, caching,
 * and providing category data with proper error handling and loading states.
 * 
 * Features:
 * - Category listing with mock data simulation
 * - Individual category retrieval by slug or ID
 * - Automatic loading state management
 * - Error handling with Arabic error messages
 * - TypeScript support with proper interfaces
 * 
 * @author Yalla Souq Development Team
 * @version 2.1.0
 */

import { useState, useEffect, useCallback } from 'react';
import { mockDataService, MockCategory } from '@/lib/mockData';
import { logger } from '@/lib/logger';

/**
 * Category Interface Definition
 * 
 * Represents a category entity in the marketplace system.
 * Categories are used to organize classified ads into logical groups.
 * 
 * @interface Category
 */
interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Arabic name of the category (primary language) */
  name: string;
  /** English name of the category (optional) */
  name_en?: string;
  /** Hebrew name of the category (optional) */
  name_he?: string;
  /** URL-friendly slug for routing */
  slug: string;
  /** Emoji or icon representation */
  icon?: string;
  /** Hex color code for UI theming */
  color?: string;
  /** Parent category ID for hierarchical structure */
  parent_id?: string;
  /** Display order in category listings */
  sort_order: number;
  /** Whether the category is currently active */
  is_active: boolean;
  /** ISO timestamp of category creation */
  created_at: string;
  /** ISO timestamp of last category update */
  updated_at: string;
}

/**
 * Mock Categories Dataset
 * 
 * This array contains predefined category data for development and testing purposes.
 * In production, this would be replaced with actual database queries.
 * 
 * Each category represents a major classification for marketplace ads:
 * - Electronics: Mobile phones, computers, gadgets
 * - Vehicles: Cars, motorcycles, automotive parts
 * - Real Estate: Apartments, houses, commercial properties
 * - Furniture: Home furniture and household items
 * - Fashion: Clothing, accessories, shoes
 * - Sports: Sports equipment, fitness gear
 * - Books: Educational materials, literature
 * - Services: Professional services, repairs
 * - Jobs: Employment opportunities, careers
 * 
 * @constant {Category[]} mockCategories
 */
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'الإلكترونيات', // Electronics
    slug: 'electronics',
    icon: '📱', // Mobile phone emoji
    color: '#3B82F6', // Blue theme color
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'السيارات', // Vehicles
    slug: 'cars',
    icon: '🚗', // Car emoji
    color: '#EF4444', // Red theme color
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'العقارات', // Real Estate
    slug: 'real-estate',
    icon: '🏠', // House emoji
    color: '#10B981', // Green theme color
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'الأثاث والمنزل', // Furniture & Home
    slug: 'furniture',
    icon: '🛋️', // Couch emoji
    color: '#F59E0B', // Orange theme color
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'الملابس والأزياء', // Fashion & Clothing
    slug: 'fashion',
    icon: '👕', // T-shirt emoji
    color: '#8B5CF6', // Purple theme color
    sort_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'الرياضة والترفيه', // Sports & Recreation
    slug: 'sports',
    icon: '⚽', // Soccer ball emoji
    color: '#06B6D4', // Cyan theme color
    sort_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'الكتب والتعليم', // Books & Education
    slug: 'books',
    icon: '📚', // Books emoji
    color: '#84CC16', // Lime theme color
    sort_order: 7,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'الخدمات', // Services
    slug: 'services',
    icon: '🔧', // Wrench emoji
    color: '#F97316', // Orange theme color
    sort_order: 8,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'الوظائف', // Jobs & Careers
    slug: 'jobs',
    icon: '💼', // Briefcase emoji
    color: '#6366F1', // Indigo theme color
    sort_order: 9,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * useCategories Custom Hook
 * 
 * This is the main hook function that provides category management functionality.
 * It implements a complete CRUD-like interface for category operations with
 * proper state management, error handling, and loading indicators.
 * 
 * State Management:
 * - categories: Array of all available categories
 * - isLoading: Boolean flag indicating data fetching status
 * - error: String containing error messages (null when no errors)
 * 
 * @returns {Object} Hook return object containing state and methods
 */
export const useCategories = () => {
  // State Variables with TypeScript type annotations
  
  /** Array containing all fetched categories */
  const [categories, setCategories] = useState<Category[]>([]);
  
  /** Loading state indicator for UI feedback */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  /** Error state for handling and displaying error messages */
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch All Categories Method
   * 
   * This asynchronous function retrieves all available categories from the data source.
   * Currently uses mock data but designed to be easily replaceable with API calls.
   * 
   * Features:
   * - Simulates realistic API behavior with artificial delay
   * - Updates loading state during operation
   * - Handles errors gracefully with Arabic error messages
   * - Returns categories array for external use
   * - Caches results in component state
   * 
   * Flow:
   * 1. Set loading state to true
   * 2. Clear any previous errors
   * 3. Simulate network delay (500ms)
   * 4. Update state with fetched categories
   * 5. Return categories for immediate use
   * 6. Handle any errors that occur
   * 7. Always clear loading state
   * 
   * @async
   * @function fetchCategories
   * @returns {Promise<Category[]>} Promise resolving to array of categories
   * @throws {Error} When category fetching fails
   */
  /**
   * Fetch All Categories Method - Enhanced with Mock Data Support
   * 
   * This enhanced version now supports both mock data and real database queries
   * based on environment configuration. The method automatically switches between
   * data sources to provide realistic development experience.
   * 
   * NEW FEATURES ADDED:
   * - Environment-based data source switching
   * - Mock data service integration for development
   * - Professional logging for debugging
   * - Seamless fallback between mock and real data
   * - Palestinian marketplace specific data structure
   * 
   * Data Source Selection:
   * - NEXT_PUBLIC_USE_MOCK_DATA=true → Uses Palestinian mock data
   * - NEXT_PUBLIC_USE_MOCK_DATA=false → Uses real Supabase data
   * 
   * Mock Data Features:
   * - Arabic category names with cultural relevance
   * - Palestinian marketplace appropriate categories
   * - Realistic icons and color themes
   * - Proper TypeScript interfaces for type safety
   * 
   * @async
   * @function fetchCategories
   * @returns {Promise<Category[]>} Promise resolving to array of categories
   * @throws {Error} When category fetching fails from any source
   */
  const fetchCategories = useCallback(async () => {
    try {
      // Start loading state for UI feedback
      setIsLoading(true);
      setError(null);

      // NEW: Check environment variable to determine data source
      // This allows developers to work with realistic test data
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        // NEW: Use mock data service for development
        logger.debug('Using mock data for categories', null, 'useCategories');
        const result = await mockDataService.getCategories();
        
        // NEW: Transform mock data to match expected Category interface
        const mappedCategories = result.data.map(mockCat => ({
          id: mockCat.id,
          name: mockCat.name,
          name_en: mockCat.name_en || mockCat.name, // Fallback to Arabic name
          slug: mockCat.slug,
          icon: mockCat.icon,
          color: mockCat.color,
          sort_order: mockCat.sort_order,
          is_active: mockCat.is_active,
          created_at: new Date().toISOString(), // Generate timestamps for consistency
          updated_at: new Date().toISOString()
        }));
        setCategories(mappedCategories);
        return mappedCategories;
      } else {
        // Fallback to mock categories for now (will be replaced with Supabase)
        logger.debug('Using fallback mock data for categories', null, 'useCategories');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setCategories(mockCategories);
        return mockCategories;
      }

    } catch (error: any) {
      // Enhanced error handling with professional logging
      const errorMessage = error.message || 'فشل في جلب الفئات'; // "Failed to fetch categories"
      setError(errorMessage);
      logger.error('Fetch categories error', error, 'useCategories');
      return []; // Return empty array on error
    } finally {
      // Always clear loading state regardless of success/failure
      setIsLoading(false);
    }
  }, []); // Empty dependency array - function never changes

  /**
   * Get Category By Slug Method
   * 
   * Retrieves a specific category using its URL-friendly slug identifier.
   * This method is commonly used in routing scenarios where the category
   * is identified by its slug in the URL path.
   * 
   * Features:
   * - Fast lookup using Array.find() method
   * - Validates category is active before returning
   * - Simulates API delay for realistic behavior
   * - Returns null when category not found
   * - Handles errors gracefully
   * 
   * Use Cases:
   * - Dynamic routing: /categories/[slug]
   * - Category page rendering
   * - Navigation and breadcrumbs
   * - URL-based category filtering
   * 
   * @async
   * @function getCategoryBySlug
   * @param {string} slug - URL-friendly category identifier
   * @returns {Promise<Category | null>} Promise resolving to category or null
   * 
   * @example
   * const category = await getCategoryBySlug('electronics');
   * if (category) {
   *   console.log(category.name); // "الإلكترونيات"
   * }
   */
  const getCategoryBySlug = useCallback(async (slug: string): Promise<Category | null> => {
    try {
      // Simulate API response time (shorter for single item)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Find category by slug and ensure it's active
      const category = mockCategories.find(cat => cat.slug === slug && cat.is_active);
      return category || null; // Return null if not found

    } catch (error: any) {
      // Log error for debugging but don't update global error state
      console.error('Get category by slug error:', error);
      return null;
    }
  }, []); // Empty dependency array - function never changes

  /**
   * Get Category By ID Method
   * 
   * Retrieves a specific category using its unique database identifier.
   * This method is typically used when you have a category ID from
   * database relations or when working with category references.
   * 
   * Features:
   * - Direct lookup by primary key (ID)
   * - Validates category is active
   * - Fast O(n) search through categories
   * - Consistent error handling
   * - Simulated API behavior
   * 
   * Use Cases:
   * - Loading category details from database relations
   * - Category management interfaces
   * - Form pre-population
   * - Category validation
   * 
   * @async
   * @function getCategoryById
   * @param {string} id - Unique category identifier
   * @returns {Promise<Category | null>} Promise resolving to category or null
   * 
   * @example
   * const category = await getCategoryById('1');
   * if (category) {
   *   console.log(category.slug); // "electronics"
   * }
   */
  const getCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    try {
      // Simulate API response time
      await new Promise(resolve => setTimeout(resolve, 200));

      // Find category by ID and ensure it's active
      const category = mockCategories.find(cat => cat.id === id && cat.is_active);
      return category || null; // Return null if not found

    } catch (error: any) {
      // Log error for debugging purposes
      console.error('Get category by ID error:', error);
      return null;
    }
  }, []); // Empty dependency array - function never changes

  /**
   * Effect Hook for Auto-Loading Categories
   * 
   * This useEffect hook automatically triggers category loading when the
   * component mounts. It ensures that categories are always available
   * when the hook is first used.
   * 
   * Behavior:
   * - Runs once on component mount
   * - Calls fetchCategories to populate initial data
   * - Dependencies include fetchCategories (though it never changes)
   * - Handles component cleanup automatically
   * 
   * @effect
   */
  useEffect(() => {
    fetchCategories(); // Load categories on mount
  }, [fetchCategories]); // Dependency: fetchCategories function

  /**
   * Hook Return Object
   * 
   * Returns an object containing all the state variables and methods
   * that consuming components need to interact with categories.
   * 
   * State Properties:
   * @property {Category[]} categories - Array of all available categories
   * @property {boolean} isLoading - Loading state indicator
   * @property {string|null} error - Error message or null
   * 
   * Methods:
   * @property {Function} fetchCategories - Fetch all categories
   * @property {Function} getCategoryBySlug - Get category by slug
   * @property {Function} getCategoryById - Get category by ID
   * @property {Function} setError - Manual error state setter
   * 
   * @returns {Object} Complete hook interface
   */
  return {
    // State variables
    categories,    // All fetched categories
    isLoading,     // Loading state for UI
    error,         // Error state for error handling
    
    // Methods
    fetchCategories,     // Fetch all categories method
    getCategoryBySlug,   // Get single category by slug
    getCategoryById,     // Get single category by ID
    setError            // Manual error state setter for external error handling
  };
};

/**
 * Type Exports
 * 
 * Export the Category interface for use in other components and modules.
 * This ensures type consistency across the application.
 */
export type { Category };

/**
 * Default Export
 * 
 * Export the useCategories hook as the default export for convenient importing.
 * 
 * @example
 * import useCategories from '@/hooks/useCategories';
 * // or
 * import { useCategories } from '@/hooks/useCategories';
 */
export default useCategories;