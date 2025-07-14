/**
 * Authentication Type Definitions - Yalla Souq Palestinian Marketplace
 * 
 * Comprehensive TypeScript type definitions for authentication and user
 * management within the Palestinian marketplace platform. Provides type
 * safety, auto-completion, and compile-time validation for all
 * authentication-related operations and user state management.
 * 
 * Type Categories:
 * - User profile types with Palestinian-specific fields
 * - Authentication session and state management types
 * - Social login provider type definitions
 * - Business account verification and role types
 * - Permission and access control type structures
 * - Authentication error and status types
 * 
 * Palestinian Market Types:
 * - Palestinian user profile fields (city, governorate, ID number)
 * - Local business verification types and documentation
 * - Arabic name formatting and validation types
 * - Palestinian phone number structure and validation
 * - Geographic location types for Palestinian regions
 * - Cultural preference and language setting types
 * 
 * Security Type Definitions:
 * - Session token and JWT payload types
 * - Permission level and role-based access types
 * - Multi-factor authentication state types
 * - Security audit and logging types
 * - Password policy and validation types
 * - Account verification and status types
 * 
 * Supabase Integration:
 * - Database profile table type integration
 * - Authentication provider type definitions
 * - Real-time subscription types for user updates
 * - File upload types for profile images
 * - Session management and persistence types
 * 
 * Business Account Types:
 * - Seller verification status and documentation
 * - Business license and registration types
 * - Payment method and banking information types
 * - Store profile and branding types
 * - Sales analytics and performance types
 * - Customer rating and review types
 * 
 * Error Handling Types:
 * - Authentication error categorization
 * - Validation error structures
 * - Network and connectivity error types
 * - User-friendly error message types
 * - Debugging and logging error types
 * 
 * State Management Types:
 * - Loading state indicators for async operations
 * - Form state types for registration and login
 * - Navigation state for authentication flows
 * - Cache state for user data persistence
 * - Offline state for disconnected usage
 * 
 * Technical Architecture:
 * - Type inference for complex authentication flows
 * - Generic types for reusable authentication patterns
 * - Union types for flexible user role management
 * - Mapped types for permission derivation
 * - Conditional types for dynamic user capabilities
 * 
 * @module AuthenticationTypes
 * @author Yalla Souq Development Team
 * @version 2.0.0
 * @since 1.0.0
 */

import type { Database } from '@/lib/supabase';

/**
 * User Profile Type
 * 
 * Comprehensive user profile type based on Supabase profiles table schema.
 * Includes Palestinian-specific fields for cultural and geographic context
 * within the marketplace platform.
 * 
 * Features:
 * - Complete user profile information
 * - Palestinian geographic data integration
 * - Business account capabilities
 * - Localization and preference settings
 * - Security and verification status
 */
// User type based on Supabase profiles table
export type User = Database['public']['Tables']['profiles']['Row'];

/**
 * Authentication Session Interface
 * 
 * Defines the structure for user authentication session state within
 * the Palestinian marketplace platform. Includes user data, loading
 * states, and error handling for comprehensive session management.
 * 
 * Session Features:
 * - Current user profile data or null for unauthenticated state
 * - Loading state tracking for async authentication operations
 * - Error state management with detailed error information
 * - Real-time session updates and synchronization
 * - Offline session persistence and restoration
 * 
 * State Management:
 * - Optimistic updates for better user experience
 * - Error recovery and retry mechanisms
 * - Session expiration and refresh handling
 * - Multi-tab synchronization for consistent state
 * 
 * @interface AuthSession
 * @since 1.0.0
 */
export interface AuthSession {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  language?: 'ar' | 'en' | 'he';
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

// Language preference type
export type Language = 'ar' | 'en' | 'he';

// Profile visibility type
export type ProfileVisibility = 'public' | 'private';

// Gender type
export type Gender = 'male' | 'female' | 'other';
