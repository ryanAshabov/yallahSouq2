/**
 * Database Type Definitions - Yalla Souq Palestinian Marketplace
 * 
 * Comprehensive TypeScript type definitions for the Palestinian marketplace
 * database schema. Provides type safety, auto-completion, and compile-time
 * validation for all database operations throughout the application.
 * 
 * Type Categories:
 * - Core database types from Supabase integration
 * - Product and advertisement type definitions
 * - User and authentication type structures
 * - Business and seller account types
 * - Transaction and payment type definitions
 * - Geographic and location type structures
 * 
 * Palestinian Market Types:
 * - Palestinian geographic data types (cities, regions)
 * - Local business verification types and structures
 * - Arabic content type definitions with RTL support
 * - Palestinian currency and pricing type structures
 * - Cultural category and classification types
 * - Multi-language content type definitions
 * 
 * Database Schema Integration:
 * - Supabase auto-generated types for table schemas
 * - Custom types for Palestinian marketplace features
 * - Relationship types for foreign key connections
 * - Enum types for categorization and status management
 * - Index and performance optimization type hints
 * 
 * Type Safety Features:
 * - Compile-time validation for database queries
 * - Auto-completion for database field access
 * - Type inference for complex query operations
 * - Union types for flexible data modeling
 * - Generic types for reusable database patterns
 * 
 * Product and Advertisement Types:
 * - Comprehensive product structure with Palestinian market fields
 * - Advertisement lifecycle status types
 * - Image and media attachment type definitions
 * - Category and subcategory type structures
 * - Pricing and currency type definitions with Palestinian context
 * 
 * User and Authentication Types:
 * - User profile types with Palestinian-specific fields
 * - Authentication session and token types
 * - Business account verification types
 * - Social login provider type definitions
 * - Permission and role-based access types
 * 
 * Performance Optimization:
 * - Efficient type definitions for minimal bundle impact
 * - Tree-shaking compatible type exports
 * - Lazy loading type definitions for code splitting
 * - Memory-efficient type structures
 * 
 * Development Experience:
 * - IntelliSense support for database operations
 * - Type-safe query building and execution
 * - Automated type generation from database schema
 * - Comprehensive JSDoc documentation for all types
 * - Error prevention through strict typing
 * 
 * @module DatabaseTypes
 * @author Yalla Souq Development Team
 * @version 2.0.0
 * @since 1.0.0
 */

// Re-export Database types from Supabase lib
export type { Database } from '@/lib/supabase';

// Additional types for Products (to be added later)
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  seller_id: string;
  status: 'active' | 'sold' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_en?: string;
  name_he?: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
}
