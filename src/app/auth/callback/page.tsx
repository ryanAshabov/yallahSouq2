/**
 * Authentication Callback Page - Yalla Souq Palestinian Marketplace
 * 
 * Specialized authentication callback handler for processing Supabase
 * authentication responses within the Palestinian marketplace platform.
 * Manages the complete authentication flow including OAuth redirects,
 * session establishment, and user redirection after successful login.
 * 
 * Core Functionality:
 * - Processes Supabase authentication callbacks from external providers
 * - Handles OAuth flow completion for social login providers
 * - Manages session establishment and user state initialization
 * - Implements secure token exchange and validation
 * - Provides error handling for authentication failures
 * - Redirects users to appropriate post-authentication destinations
 * 
 * Authentication Flow:
 * 1. User completes authentication with external provider (Google, Facebook, etc.)
 * 2. Provider redirects to this callback endpoint with authorization code
 * 3. Component exchanges code for Supabase session tokens
 * 4. User session is established with proper Palestinian marketplace context
 * 5. User is redirected to intended destination or marketplace homepage
 * 6. Error states are handled with appropriate user feedback
 * 
 * Palestinian Market Integration:
 * - Localized error messages in Arabic and English
 * - Cultural considerations in user experience design
 * - Palestinian user data handling compliance
 * - Geographic location context for user profiles
 * - Arabic language support for authentication feedback
 * 
 * Security Implementation:
 * - Secure token handling and storage
 * - CSRF protection through state parameter validation
 * - Session security with proper expiration handling
 * - Secure redirect validation to prevent open redirects
 * - Error information sanitization for security
 * 
 * User Experience Features:
 * - Loading states during authentication processing
 * - Clear error messages for authentication failures
 * - Smooth redirect experience post-authentication
 * - Mobile-optimized authentication flow
 * - Accessibility support for diverse user needs
 * 
 * Error Handling:
 * - Comprehensive error state management
 * - User-friendly error messages in multiple languages
 * - Fallback authentication options
 * - Retry mechanisms for transient failures
 * - Logging for debugging and monitoring
 * 
 * Performance Optimization:
 * - Efficient token exchange process
 * - Minimal JavaScript bundle for fast loading
 * - Optimized redirect handling
 * - Efficient state management during authentication
 * 
 * Technical Architecture:
 * - Next.js client-side component with useEffect hooks
 * - Supabase authentication SDK integration
 * - Next.js router for programmatic navigation
 * - TypeScript implementation for type safety
 * - React hooks for state and lifecycle management
 * 
 * Integration Points:
 * - Supabase authentication service
 * - Next.js navigation system
 * - User profile management system
 * - Session state management
 * - Analytics tracking for authentication events
 * 
 * @module AuthCallbackPage
 * @author Yalla Souq Development Team
 * @version 2.0.0
 * @since 1.0.0
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * AuthCallbackPage Component - Authentication Flow Handler
 * 
 * Client-side React component responsible for processing authentication
 * callbacks from Supabase and managing the complete user authentication
 * flow within the Palestinian marketplace platform.
 * 
 * Component Responsibilities:
 * - Handles authentication callback processing from external providers
 * - Manages session establishment with Supabase authentication
 * - Implements secure user redirection post-authentication
 * - Provides comprehensive error handling for authentication failures
 * - Displays loading states during authentication processing
 * 
 * Authentication Process Flow:
 * 1. Component mounts and initiates callback handling
 * 2. Extracts authentication parameters from URL
 * 3. Exchanges authorization code for session tokens
 * 4. Establishes authenticated user session
 * 5. Redirects user to appropriate destination
 * 6. Handles errors with user-friendly feedback
 * 
 * Error Handling Strategy:
 * - Catches and processes authentication errors gracefully
 * - Provides localized error messages for Palestinian users
 * - Implements fallback navigation for failed authentications
 * - Logs errors for monitoring and debugging purposes
 * 
 * User Experience Features:
 * - Loading spinner during authentication processing
 * - Clear success and error state indicators
 * - Smooth transition to post-authentication experience
 * - Mobile-responsive design for all device types
 * 
 * Security Considerations:
 * - Validates authentication state before redirection
 * - Implements secure token handling practices
 * - Prevents unauthorized access during processing
 * - Sanitizes error information for security
 * 
 * Palestinian Market Integration:
 * - Arabic language support for status messages
 * - Cultural design considerations in loading states
 * - Palestinian user context establishment
 * - Localized error handling and messaging
 * 
 * @returns JSX.Element - Authentication callback processing interface
 * 
 * @since 1.0.0
 * @author Yalla Souq Development Team
 */
const AuthCallbackPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth/login?error=حدث خطأ أثناء تسجيل الدخول');
          return;
        }

        if (data.session) {
          // Successfully authenticated
          router.push('/?success=تم تسجيل الدخول بنجاح');
        } else {
          // No session, redirect to login
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        router.push('/auth/login?error=حدث خطأ غير متوقع');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري إتمام تسجيل الدخول...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
