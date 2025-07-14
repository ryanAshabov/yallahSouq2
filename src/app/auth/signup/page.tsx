/**
 * Signup Page - Yalla Souq Palestinian Marketplace
 * 
 * This page component handles the signup page routing, authentication checks,
 * and redirects after successful registration. It uses the Signup component for the UI.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Signup from '@/components/auth/Signup';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export default function SignupPage() {
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
          logger.info('User already logged in, redirecting to dashboard', null, 'SignupPage');
          router.push('/dashboard');
          return;
        }

        // Check for email verification success
        const emailConfirmed = searchParams.get('email_confirmed');
        if (emailConfirmed === 'true') {
          // Show success message for email confirmation
          logger.info('Email confirmed successfully', null, 'SignupPage');
        }

      } catch (error) {
        logger.error('Auth check error', error, 'SignupPage');
      } finally {
        // Set loading to false regardless of outcome
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  /**
   * Handle successful signup
   * Redirects user to appropriate page after registration
   */
  const handleSignupSuccess = (user: any) => {
    try {
      // Check if email verification is required
      if (user.email_confirmed_at) {
        // Email is already confirmed, redirect to profile setup
        logger.info('Signup successful, email already confirmed', { userId: user.id }, 'SignupPage');
        router.push('/profile/setup');
      } else {
        // Email confirmation required, redirect to verification page
        logger.info('Signup successful, email verification required', { userId: user.id }, 'SignupPage');
        router.push(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
      }
    } catch (error) {
      logger.error('Signup success handler error', error, 'SignupPage');
      
      // Default redirect to email verification
      router.push('/auth/verify-email');
    }
  };

  /**
   * Handle redirect to login page
   */
  const handleLoginRedirect = () => {
    // Preserve the redirect parameter if it exists
    const redirectParam = searchParams.get('redirect');
    const loginUrl = redirectParam 
      ? `/auth/login?redirect=${encodeURIComponent(redirectParam)}`
      : '/auth/login';
    
    router.push(loginUrl);
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

  // Render signup component
  return (
    <Signup 
      onSuccess={handleSignupSuccess}
      onLoginRedirect={handleLoginRedirect}
    />
  );
}