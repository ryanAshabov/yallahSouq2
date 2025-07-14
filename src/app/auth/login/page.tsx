'use client';

/**
 * Login Page - Yalla Souq Palestinian
 * Main login page with routing and state management
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/auth/Login';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
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
      console.log('Login success, redirecting user', user);
      let profile;
      
      // Check if we're using mock data and this is a mock user
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && user.id?.startsWith('mock-user-')) {
        // Create mock profile instead of querying Supabase
        profile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Mock User',
          is_business_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Immediate redirect for mock users
        router.push('/dashboard');
        return;
      } else {
        // Get user profile from Supabase for real users
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profile = data;
      }

      if (profile) {
        // Redirect based on user type or preferences
        if (profile.is_business_verified) {
          router.push('/business/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        // New user, redirect to complete profile
        router.push('/profile/setup');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Default redirect
      router.push('/dashboard');
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