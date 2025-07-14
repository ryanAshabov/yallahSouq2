/**
 * VerifyEmailPage Component - Email Verification Handler
 * 
 * This React component handles email verification for the Yalla Souq Palestinian Marketplace.
 * It processes email verification tokens from Supabase authentication system and provides
 * user feedback throughout the verification process.
 * 
 * Features:
 * - Automatic token extraction from URL parameters
 * - Real-time verification status updates with visual feedback
 * - Multi-language support (Arabic primary)
 * - Automatic redirection after successful verification
 * - Error handling with user-friendly messages
 * - Responsive design with Palestinian branding
 * 
 * Flow:
 * 1. Extract verification tokens from URL search parameters
 * 2. Call Supabase OTP verification API
 * 3. Handle success/error states with appropriate UI
 * 4. Redirect to login page after successful verification
 * 
 * URL Parameters:
 * @param {string} token_hash - Verification token from email
 * @param {string} type - Verification type (usually 'email')
 * @param {string} email - User's email address (optional)
 * 
 * @component
 * @author Yalla Souq Development Team
 * @version 2.1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * VerifyEmailPage Functional Component
 * 
 * Main component function that handles the email verification process.
 * Uses React hooks for state management and side effects.
 * 
 * State Management:
 * - status: Controls UI display based on verification progress
 * - message: Stores user-facing messages for feedback
 * 
 * Hooks Used:
 * - useRouter: For programmatic navigation
 * - useSearchParams: For reading URL parameters
 * - useState: For component state management
 * - useEffect: For handling side effects on mount
 * 
 * @returns {JSX.Element} Rendered verification page component
 */
const VerifyEmailPage: React.FC = () => {
  // Navigation and URL parameter hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Component state with TypeScript type definitions
  
  /** Current verification status - determines which UI to show */
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  
  /** User-facing message for feedback and error reporting */
  const [message, setMessage] = useState<string>('');

  /**
   * Effect Hook for Email Verification Process
   * 
   * This useEffect handles the core email verification logic when the component mounts.
   * It extracts tokens from URL parameters and communicates with Supabase auth system.
   * 
   * Process Flow:
   * 1. Extract verification parameters from URL
   * 2. Validate required tokens exist
   * 3. Call Supabase OTP verification API
   * 4. Handle successful verification response
   * 5. Set appropriate status and user messages
   * 6. Schedule automatic redirection on success
   * 7. Handle and display any errors that occur
   * 
   * URL Parameter Handling:
   * - token_hash: Required for verification
   * - type: Verification type from Supabase
   * - email: Optional, used for confirmation messages
   * 
   * @effect
   */
  useEffect(() => {
    /**
     * Async Email Verification Handler
     * 
     * Handles the actual verification process with Supabase.
     * Separated into its own function for better error handling and readability.
     * 
     * @async
     * @function handleEmailVerification
     * @throws {Error} When verification fails or tokens are invalid
     */
    const handleEmailVerification = async () => {
      try {
        // Extract verification tokens from URL search parameters
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        if (token_hash && type) {
          // Verify the email with Supabase OTP system
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any, // Type assertion for Supabase types
          });

          if (error) {
            throw error; // Re-throw to be caught by outer try-catch
          }

          if (data.user) {
            // Verification successful - update UI and schedule redirect
            setStatus('success');
            setMessage('تم تأكيد البريد الإلكتروني بنجاح! 🎉'); // "Email verified successfully!"
            
            // Automatic redirect to login page after 3 seconds
            setTimeout(() => {
              router.push('/auth/login?message=تم تأكيد البريد الإلكتروني، يمكنك تسجيل الدخول الآن');
            }, 3000);
          }
        } else if (email) {
          // Show confirmation that verification email was sent
          setStatus('success');
          setMessage(`تم إرسال رابط التأكيد إلى ${email}`); // "Verification link sent to {email}"
        } else {
          // No valid tokens found in URL
          throw new Error('رابط التأكيد غير صالح'); // "Invalid verification link"
        }
      } catch (error: any) {
        // Handle all verification errors
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(error.message || 'حدث خطأ أثناء تأكيد البريد الإلكتروني'); // "Error occurred during email verification"
      }
    };

    // Execute verification process
    handleEmailVerification();
  }, [searchParams, router]); // Dependencies: URL parameters and router

  /**
   * Component Render Method
   * 
   * Renders the email verification page with different states based on verification status.
   * Uses conditional rendering to show appropriate UI for loading, success, and error states.
   * 
   * Layout Structure:
   * - Full-screen centered container with RTL support
   * - Brand header with Palestinian flag
   * - Dynamic status content area
   * - Footer with Palestinian branding
   * 
   * States Rendered:
   * - Loading: Spinner with progress message
   * - Success: Checkmark with success message and auto-redirect notice
   * - Error: Error icon with error message and action buttons
   * 
   * @returns {JSX.Element} Complete verification page UI
   */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          
          {/* Brand Header Section */}
          {/* Palestinian marketplace logo with flag indicator */}
          <div className="flex justify-center items-center mb-6">
            <span className="text-3xl">🛒</span> {/* Shopping cart icon */}
            <h1 className="text-2xl font-bold text-blue-600 mr-2">يلا سوق</h1> {/* "Yalla Souq" */}
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">🇵🇸</span> {/* Palestinian flag */}
          </div>

          {/* Dynamic Status Content Area */}
          {/* Loading State - Show spinner and loading message */}
          {status === 'loading' && (
            <div>
              {/* Animated loading spinner */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                جاري تأكيد البريد الإلكتروني... {/* "Verifying email..." */}
              </h2>
              <p className="text-gray-600">
                يرجى الانتظار بينما نؤكد بريدك الإلكتروني {/* "Please wait while we verify your email" */}
              </p>
            </div>
          )}

          {/* Success State - Show checkmark and success message */}
          {status === 'success' && (
            <div>
              <div className="text-6xl mb-4">✅</div> {/* Large checkmark emoji */}
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                تم بنجاح! {/* "Success!" */}
              </h2>
              <p className="text-gray-600 mb-6">
                {message} {/* Dynamic success message */}
              </p>
              <div className="text-sm text-gray-500">
                سيتم إعادة توجيهك تلقائياً خلال 3 ثوانٍ... {/* "You will be redirected automatically in 3 seconds..." */}
              </div>
            </div>
          )}

          {/* Error State - Show error icon, message, and action buttons */}
          {status === 'error' && (
            <div>
              <div className="text-6xl mb-4">❌</div> {/* Large X emoji for error */}
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                حدث خطأ {/* "An error occurred" */}
              </h2>
              <p className="text-gray-600 mb-6">
                {message} {/* Dynamic error message */}
              </p>
              
              {/* Action Buttons for Error Recovery */}
              <div className="space-y-3">
                {/* Primary action - Return to signup */}
                <Link href="/auth/signup">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    العودة للتسجيل {/* "Return to signup" */}
                  </button>
                </Link>
                
                {/* Secondary action - Go to login */}
                <Link href="/auth/login">
                  <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    تسجيل الدخول {/* "Login" */}
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Footer Section */}
          {/* Palestinian marketplace branding */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>🇵🇸 منصة الإعلانات المبوبة الفلسطينية</p> {/* "Palestinian Classified Ads Platform" */}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Component Export
 * 
 * Export the VerifyEmailPage component as the default export.
 * This allows the component to be imported and used as a page component
 * in the Next.js app router system.
 * 
 * @default VerifyEmailPage
 */
export default VerifyEmailPage;
