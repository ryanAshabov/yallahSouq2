/**
 * Login Page - Yalla Souq Palestinian Marketplace
 * 
 * This page component handles the login page routing, authentication checks,
 * and redirects after successful login. It uses the Login component for the UI.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Login from '@/components/auth/Login';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export default function LoginPage() {
  // Hooks for navigation and query parameters
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Loading state for initial auth check
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Check if user is already logged in
   * If logged in, redirect to dashboard
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is already logged in, redirect to dashboard
          logger.info('User already logged in, redirecting to dashboard', null, 'LoginPage');
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        logger.error('Auth check error', error, 'LoginPage');
      } finally {
        // Set loading to false regardless of outcome
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  /**
   * Handle successful login
   * Redirects user to appropriate page after login
   */
  const handleLoginSuccess = (user: any) => {
    try {
      // Get redirect URL from query params or use default
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      
      logger.info('Login successful, redirecting user', { redirectPath }, 'LoginPage');
      
      // Use router.push for navigation within the app
      router.push(redirectPath);
    } catch (error) {
      logger.error('Login redirect error', error, 'LoginPage');
      
      // Fallback to dashboard on error
      router.push('/dashboard');
    }
  };

  /**
   * Handle redirect to signup page
   */
  const handleSignupRedirect = () => {
    // Preserve the redirect parameter if it exists
    const redirectParam = searchParams.get('redirect');
    const signupUrl = redirectParam 
      ? `/auth/signup?redirect=${encodeURIComponent(redirectParam)}`
      : '/auth/signup';
    
    router.push(signupUrl);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Render login component
  return (
    <Login 
      onSuccess={handleLoginSuccess}
      onSignupRedirect={handleSignupRedirect}
    />
  );
}