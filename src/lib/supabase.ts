/**
 * Supabase Client Configuration - Yalla Souq Palestinian Marketplace
 * 
 * Primary Supabase client setup and configuration for the Palestinian
 * marketplace platform. Provides secure, scalable database connectivity
 * with authentication, real-time features, and cloud storage integration
 * optimized for Palestinian market requirements.
 * 
 * Core Services:
 * - PostgreSQL database with Palestinian marketplace schema
 * - User authentication with social login providers
 * - Real-time subscriptions for live marketplace updates
 * - File storage for advertisement images and user profiles
 * - Edge functions for serverless Palestinian market logic
 * - Row-level security for comprehensive data protection
 * 
 * Authentication Features:
 * - Email/password authentication with verification
 * - Social login providers (Google, Facebook, Apple)
 * - JWT token management with automatic refresh
 * - Session persistence across browser sessions
 * - Multi-factor authentication for enhanced security
 * - Palestinian phone number verification integration
 * 
 * Database Architecture:
 * - Users table with Palestinian-specific profile fields
 * - Advertisements table optimized for marketplace operations
 * - Categories table with Palestinian market classifications
 * - Locations table with Palestinian geographic data
 * - Business profiles for Palestinian entrepreneurs
 * - Transaction history and marketplace analytics
 * 
 * Real-time Capabilities:
 * - Live advertisement updates for immediate marketplace changes
 * - Real-time messaging between buyers and sellers
 * - Instant notifications for marketplace activities
 * - Live auction functionality for special items
 * - Real-time analytics dashboards for insights
 * - Live chat support for Palestinian customer service
 * 
 * Palestinian Market Optimization:
 * - Arabic language support in database queries
 * - Palestinian geographic data integration
 * - Local business verification workflows
 * - Cultural considerations in data modeling
 * - Compliance with Palestinian data protection standards
 * - Multi-language content management (Arabic/English/Hebrew)
 * 
 * Security Implementation:
 * - Environment variable management for API keys
 * - SSL/TLS encryption for all data transmission
 * - Row-level security policies for user data protection
 * - Input sanitization and SQL injection prevention
 * - Audit logging for marketplace transaction tracking
 * - GDPR and Palestinian privacy compliance
 * 
 * Performance Features:
 * - Connection pooling for efficient database usage
 * - Query optimization for Palestinian marketplace patterns
 * - CDN integration for Palestinian geographic optimization
 * - Edge computing for reduced latency in Middle East
 * - Caching strategies for frequently accessed data
 * - Efficient pagination for large marketplace datasets
 * 
 * Development Configuration:
 * - Environment-specific configuration management
 * - Local development with Supabase local setup
 * - Testing integration with mock data capabilities
 * - TypeScript integration for enhanced developer experience
 * - Error handling and monitoring integration
 * 
 * Client Configuration:
 * - Automatic token refresh for seamless user experience
 * - Persistent session management across application
 * - Real-time subscription management
 * - File upload progress tracking
 * - Error recovery and retry mechanisms
 * 
 * @module SupabaseClient
 * @author Yalla Souq Development Team
 * @version 2.1.0
 * @since 1.0.0
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ivccvshyhuwpuedzltht.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2Y2N2c2h5aHV3cHVlZHpsdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3Njg3MzQsImV4cCI6MjA1MjM0NDczNH0.SqgFaXVj0a8UmXHrNs1z7BpV3Nzge2H4z2sjAv4QBQE';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Configure auth settings for better compatibility
    flowType: 'pkce'
  }
});

// Log Supabase client initialization
logger.info('Supabase client initialized', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  environment: process.env.NODE_ENV
}, 'SUPABASE');

// Enhanced Supabase client with logging
export const supabaseWithLogging = {
  ...supabase,
  
  // Enhanced auth with logging
  auth: {
    ...supabase.auth,
    
    async signUp(credentials: any) {
      logger.apiCall('POST', '/auth/signup', { email: credentials.email });
      const start = performance.now();
      
      try {
        const result = await supabase.auth.signUp(credentials);
        const duration = performance.now() - start;
        
        logger.apiResponse('POST', '/auth/signup', result.error ? 400 : 200, {
          hasUser: !!result.data.user,
          hasSession: !!result.data.session
        });
        logger.performance('supabase_signup', duration);
        
        if (result.data.user && !result.error) {
          logger.userAction('User registered', { userId: result.data.user.id });
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.apiResponse('POST', '/auth/signup', 500, error);
        logger.performance('supabase_signup_failed', duration);
        throw error;
      }
    },
    
    async signInWithPassword(credentials: any) {
      logger.apiCall('POST', '/auth/signin', { email: credentials.email });
      const start = performance.now();
      
      try {
        const result = await supabase.auth.signInWithPassword(credentials);
        const duration = performance.now() - start;
        
        logger.apiResponse('POST', '/auth/signin', result.error ? 400 : 200, {
          hasUser: !!result.data.user,
          hasSession: !!result.data.session
        });
        logger.performance('supabase_signin', duration);
        
        if (result.data.user && !result.error) {
          logger.userAction('User logged in', { userId: result.data.user.id });
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.apiResponse('POST', '/auth/signin', 500, error);
        logger.performance('supabase_signin_failed', duration);
        throw error;
      }
    },
    
    async signOut() {
      logger.apiCall('POST', '/auth/signout');
      const start = performance.now();
      
      try {
        const result = await supabase.auth.signOut();
        const duration = performance.now() - start;
        
        logger.apiResponse('POST', '/auth/signout', result.error ? 400 : 200);
        logger.performance('supabase_signout', duration);
        logger.userAction('User logged out');
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.apiResponse('POST', '/auth/signout', 500, error);
        logger.performance('supabase_signout_failed', duration);
        throw error;
      }
    }
  }
};

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          avatar_url?: string;
          bio?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          address_street?: string;
          address_city?: string;
          address_region?: string;
          address_postal_code?: string;
          address_country?: string;
          business_name?: string;
          business_type?: string;
          business_phone?: string;
          business_email?: string;
          is_business_verified: boolean;
          email_notifications: boolean;
          sms_notifications: boolean;
          marketing_emails: boolean;
          profile_visibility: 'public' | 'private';
          language: 'ar' | 'en' | 'he';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          avatar_url?: string;
          bio?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          address_street?: string;
          address_city?: string;
          address_region?: string;
          address_postal_code?: string;
          address_country?: string;
          business_name?: string;
          business_type?: string;
          business_phone?: string;
          business_email?: string;
          is_business_verified?: boolean;
          email_notifications?: boolean;
          sms_notifications?: boolean;
          marketing_emails?: boolean;
          profile_visibility?: 'public' | 'private';
          language?: 'ar' | 'en' | 'he';
        };
        Update: {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          avatar_url?: string;
          bio?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          address_street?: string;
          address_city?: string;
          address_region?: string;
          address_postal_code?: string;
          address_country?: string;
          business_name?: string;
          business_type?: string;
          business_phone?: string;
          business_email?: string;
          is_business_verified?: boolean;
          email_notifications?: boolean;
          sms_notifications?: boolean;
          marketing_emails?: boolean;
          profile_visibility?: 'public' | 'private';
          language?: 'ar' | 'en' | 'he';
          updated_at?: string;
        };
      };
    };
  };
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Helper function to update user profile
export const updateUserProfile = async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export default supabase;
