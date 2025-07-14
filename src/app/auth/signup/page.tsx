'use client';

/**
 * Signup Page - Yalla Souq Palestinian
 * Main signup page with routing and state management
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Signup from '@/components/auth/Signup';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
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

        // Check for email verification success
        const emailConfirmed = searchParams.get('email_confirmed');
        if (emailConfirmed === 'true') {
          // Show success message for email confirmation
          console.log('Email confirmed successfully');
        }

      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  // Handle successful signup
  const handleSignupSuccess = async (user: any) => {
    try {
      if (user.email_confirmed_at) {
        // Email is already confirmed, redirect to dashboard
        router.push('/dashboard');
      } else {
        // Email confirmation required, redirect to verification page
        router.push(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
      }
    } catch (error) {
      console.error('Signup success handling error:', error);
      // Default redirect to email verification
      router.push('/auth/verify-email');
    }
  };

  // Handle redirect to login
  const handleLoginRedirect = () => {
    router.push('/auth/login');
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
    <Signup 
      onSuccess={handleSignupSuccess}
      onLoginRedirect={handleLoginRedirect}
    />
  );
}