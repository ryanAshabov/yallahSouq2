'use client';

/**
 * Login Page - Yalla Souq Palestinian
 * Main login page with routing and state management
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Login from '@/components/auth/Login';
import { supabase } from '@/lib/supabase'; 
import { logger } from '@/lib/logger';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is already logged in, redirect to dashboard
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Handle successful login
  const handleLoginSuccess = async (user: any) => {
    try {
      // Get redirect URL from query params or use default (relative path only)
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      logger.info('Login success, redirecting to', { redirectPath }, 'LoginPage');
      
      // In WebContainer, we need to use relative paths for navigation
      const redirectTo = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
      
      // Check if we're using mock data and this is a mock user
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && user.id?.startsWith('mock-user-')) {
        // For real users, get profile from Supabase
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profile && profile.is_business_verified) {
            // Business users get special routing
            const businessRedirect = redirectTo.includes('/business') ? redirectTo : '/business/dashboard';
            router.replace(businessRedirect);
          } else if (profile) {
            // Regular users with profile
            router.replace(redirectTo);
          } else {
            // New user without profile
            router.replace('/profile/setup');
          }
        } catch (error) {
          logger.error('Profile fetch error', error, 'LoginPage');
          // Default redirect on error
          router.replace('/dashboard');
        }
      }
    } catch (error) {
      logger.error('Login success handler error', error, 'LoginPage');
      // Fallback redirect
      router.replace('/dashboard');
    }
  };

  // Handle redirect to signup
  const handleSignupRedirect = () => {
    router.push('/auth/signup');
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

  return (
    <Login 
      onSuccess={handleLoginSuccess}
      onSignupRedirect={handleSignupRedirect}
    />
  );
}