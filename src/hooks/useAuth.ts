/**
 * useAuth Hook - Yalla Souq Palestinian Marketplace
 * 
 * This hook provides centralized authentication functionality for the entire application.
 * It handles user login, signup, logout, and session management with both real Supabase
 * authentication and mock authentication for development.
 */
import { useEffect, useState, useCallback } from 'react';
import { supabase, getUserProfile } from '@/lib/supabase';
import { logger } from '@/lib/logger';

// User profile interface
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  
  // Address information
  address_street?: string;
  address_city?: string;
  address_region?: string;
  address_postal_code?: string;
  address_country?: string;
  
  // Business profile
  business_name?: string;
  business_type?: string;
  business_phone?: string;
  business_email?: string;
  business_address?: string;
  tax_number?: string;
  is_business_verified: boolean;
  
  // Settings
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  profile_visibility: 'public' | 'private';
  language: 'ar' | 'en' | 'he';
  
  // Verification status
  email_verified: boolean;
  phone_verified: boolean;
  
  // Account status
  account_status: 'active' | 'suspended' | 'pending';
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Authentication session state
interface AuthSession {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Authentication error
interface AuthError {
  code?: string;
  message: string;
}

// Login credentials
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Signup data
interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
  receiveNewsletter?: boolean;
}

// Authentication response
interface AuthResponse {
  success: boolean;
  error?: AuthError;
  user?: User;
  session?: any;
}

/**
 * Main authentication hook
 * Provides complete authentication functionality for the application
 */
export const useAuth = () => {
  // Authentication session state
  const [session, setSession] = useState<AuthSession>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  // Security tracking state
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  /**
   * Initialize authentication session
   * Checks for existing session and sets up auth state change listener
   */
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session: authSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          logger.error('Session initialization error', error, 'useAuth');
          setSession({ 
            user: null, 
            isLoading: false, 
            error: getErrorMessage(error.message), 
            isAuthenticated: false 
          });
          return;
        }

        if (authSession?.user) {
          try {
            // Check if using mock data and user ID is a mock ID
            const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
            const isMockUser = authSession.user.id.startsWith('mock-user-');
            
            if (useMockData && isMockUser) {
              // Create mock user profile for development
              const mockProfile = {
                id: authSession.user.id,
                email: authSession.user.email || '',
                first_name: 'مستخدم',
                last_name: 'تجريبي',
                phone: '+970123456789',
                is_business_verified: false,
                email_notifications: true,
                sms_notifications: true,
                marketing_emails: true,
                profile_visibility: 'public' as const,
                language: 'ar' as const,
                email_verified: true,
                phone_verified: true,
                account_status: 'active' as const,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } as User;
              
              if (!mounted) return;
              
              setSession({ 
                user: mockProfile, 
                isLoading: false, 
                error: null, 
                isAuthenticated: true 
              });
              
              logger.info('Mock user session restored', { userId: mockProfile.id }, 'useAuth');
            } else {
              // Fetch real user profile from Supabase
              const profile = await getUserProfile(authSession.user.id);
              
              if (!mounted) return;

              setSession({ 
                user: profile, 
                isLoading: false, 
                error: null, 
                isAuthenticated: true 
              });
              
              logger.info('User session restored', { userId: profile.id }, 'useAuth');
            }

            // Track successful login
            localStorage.setItem('yalla-souq-last-login', new Date().toISOString());
            
          } catch (profileError: any) {
            logger.error('Profile fetch error', profileError, 'useAuth');
            
            if (!mounted) return;
            
            setSession({ 
              user: null, 
              isLoading: false, 
              error: 'فشل في تحميل بيانات المستخدم', 
              isAuthenticated: false 
            });
          }
        } else {
          if (!mounted) return;
          setSession({ 
            user: null, 
            isLoading: false, 
            error: null, 
            isAuthenticated: false 
          });
          
          logger.debug('No active session found', null, 'useAuth');
        }
      } catch (error: any) {
        logger.error('Auth initialization error', error, 'useAuth');
        
        if (!mounted) return;
        
        setSession({ 
          user: null, 
          isLoading: false, 
          error: 'فشل في تهيئة نظام المصادقة', 
          isAuthenticated: false 
        });
      }
    };

    // Initialize authentication
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, authSession) => {
        if (!mounted) return;

        logger.debug('Auth state changed:', event, 'useAuth');

        switch (event) {
          case 'SIGNED_IN':
            if (authSession?.user) {
              try {
                // Check if using mock data and user ID is a mock ID
                const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
                const isMockUser = authSession.user.id.startsWith('mock-user-');
                
                if (useMockData && isMockUser) {
                  // Create mock user profile for development
                  const mockProfile = {
                    id: authSession.user.id,
                    email: authSession.user.email || '',
                    first_name: 'مستخدم',
                    last_name: 'تجريبي',
                    phone: '+970123456789',
                    is_business_verified: false,
                    email_notifications: true,
                    sms_notifications: true,
                    marketing_emails: true,
                    profile_visibility: 'public' as const,
                    language: 'ar' as const,
                    email_verified: true,
                    phone_verified: true,
                    account_status: 'active' as const,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  } as User;
                  
                  if (!mounted) return;
                  
                  setSession({ 
                    user: mockProfile, 
                    isLoading: false, 
                    error: null, 
                    isAuthenticated: true 
                  });
                  
                  logger.info('User signed in (mock)', { userId: mockProfile.id }, 'useAuth');
                } else {
                  // Fetch real user profile from Supabase
                  const profile = await getUserProfile(authSession.user.id);
                  
                  if (!mounted) return;
                  
                  setSession({ 
                    user: profile, 
                    isLoading: false, 
                    error: null, 
                    isAuthenticated: true 
                  });
                  
                  logger.info('User signed in', { userId: profile.id }, 'useAuth');
                }

                // Reset login attempts on successful login
                setLoginAttempts(0);
                setIsBlocked(false);
                
                // Track login
                localStorage.setItem('yalla-souq-last-login', new Date().toISOString());
                
              } catch (error: any) {
                logger.error('Profile fetch on auth change', error, 'useAuth');
                
                if (!mounted) return;
                
                setSession({ 
                  user: null, 
                  isLoading: false, 
                  error: 'فشل في تحميل بيانات المستخدم', 
                  isAuthenticated: false 
                });
              }
            }
            break;

          case 'SIGNED_OUT':
            if (!mounted) return;
            
            setSession({ 
              user: null, 
              isLoading: false, 
              error: null, 
              isAuthenticated: false 
            });

            // Clear stored data
            localStorage.removeItem('yalla-souq-last-login');
            // Keep remember email if it exists
            
            logger.info('User signed out', null, 'useAuth');
            break;

          case 'TOKEN_REFRESHED':
            logger.debug('Token refreshed successfully', null, 'useAuth');
            break;

          default:
            break;
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Login method
   * Handles both mock and real authentication based on environment
   */
  const login = useCallback(async ({ email, password, rememberMe = false }: LoginCredentials): Promise<AuthResponse> => {
    // Check if blocked due to too many attempts
    if (isBlocked) {
      logger.warn('Login blocked due to too many attempts', null, 'useAuth');
      return {
        success: false,
        error: { message: 'تم حظر المحاولات لمدة مؤقتة، يرجى المحاولة لاحقاً' }
      };
    }

    // Set loading state
    setSession(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if using mock data
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        // MOCK AUTHENTICATION (Development)
        logger.debug('Using mock authentication for development', { email }, 'useAuth');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Valid test emails for development
        const validEmails = [
          'admin@yallasouq.ps',
          'user@yallasouq.ps',
          'test@yallasouq.ps',
          'maria-ashhab@gmail.com'
        ];
        
        // Check credentials
        if (validEmails.includes(email.trim().toLowerCase()) && password.length >= 6) {
          // Create mock user
          const mockUser = {
            id: 'mock-user-' + Date.now(),
            email: email.trim().toLowerCase(),
            first_name: 'مستخدم',
            last_name: 'تجريبي',
            phone: '+970123456789',
            is_business_verified: false,
            email_notifications: true,
            sms_notifications: true,
            marketing_emails: true,
            profile_visibility: 'public' as const,
            language: 'ar' as const,
            email_verified: true,
            phone_verified: true,
            account_status: 'active' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as User;
          
          // Create mock session
          const mockSession = {
            access_token: 'mock-token-' + Date.now(),
            refresh_token: 'mock-refresh-' + Date.now(),
            expires_at: Date.now() + 3600000,
            user: mockUser
          };
          
          // Update session state
          setSession({
            user: mockUser,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          
          // Reset login attempts
          setLoginAttempts(0);
          setIsBlocked(false);
          
          // Handle remember me
          if (rememberMe) {
            localStorage.setItem('yalla-souq-remember-email', email);
          } else {
            localStorage.removeItem('yalla-souq-remember-email');
          }
          
          logger.info('Mock authentication successful', { email }, 'useAuth');
          
          return {
            success: true,
            user: mockUser,
            session: mockSession
          };
        } else {
          // Mock authentication failed
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          
          // Block after 5 failed attempts
          if (newAttempts >= 5) {
            setIsBlocked(true);
            setTimeout(() => {
              setIsBlocked(false);
              setLoginAttempts(0);
            }, 15 * 60 * 1000); // 15 minutes
            
            logger.warn('Account temporarily blocked after 5 failed attempts', { email }, 'useAuth');
          }
          
          setSession(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
          }));
          
          logger.warn('Mock authentication failed', { email, attempts: newAttempts }, 'useAuth');
          
          return {
            success: false,
            error: { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
          };
        }
      }
      
      // REAL SUPABASE AUTHENTICATION (Production)
      logger.debug('Using Supabase authentication', { email }, 'useAuth');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // Block after 5 failed attempts
        if (newAttempts >= 5) {
          setIsBlocked(true);
          setTimeout(() => {
            setIsBlocked(false);
            setLoginAttempts(0);
          }, 15 * 60 * 1000); // 15 minutes
        }

        setSession(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: getErrorMessage(error.message) 
        }));
        
        logger.warn('Authentication failed', { error: error.message, attempts: newAttempts }, 'useAuth');

        return {
          success: false,
          error: { code: error.message, message: getErrorMessage(error.message) }
        };
      }

      // Handle remember me
      if (rememberMe && data.user) {
        localStorage.setItem('yalla-souq-remember-email', email);
      } else {
        localStorage.removeItem('yalla-souq-remember-email');
      }
      
      logger.info('Authentication successful', { userId: data.user?.id }, 'useAuth');

      return { 
        success: true, 
        user: data.user as unknown as User,
        session: data.session
      };

    } catch (error: any) {
      // Handle unexpected errors
      const errorMessage = 'حدث خطأ غير متوقع أثناء تسجيل الدخول';
      
      logger.error('Login error', error, 'useAuth');
      
      setSession(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));

      return {
        success: false,
        error: { message: errorMessage }
      };
    }
  }, [loginAttempts, isBlocked]);

  /**
   * Signup method
   * Registers a new user and creates their profile
   */
  const signup = useCallback(async (signupData: SignupData): Promise<AuthResponse> => {
    const { email, password, firstName, lastName, phone, acceptTerms, receiveNewsletter = false } = signupData;

    // Validate terms acceptance
    if (!acceptTerms) {
      return {
        success: false,
        error: { message: 'يجب قبول الشروط والأحكام للمتابعة' }
      };
    }

    // Set loading state
    setSession(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if using mock data
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        // MOCK SIGNUP (Development)
        logger.debug('Using mock signup for development', { email }, 'useAuth');
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if email is already used
        const existingEmails = [
          'admin@yallasouq.ps',
          'user@yallasouq.ps',
          'test@yallasouq.ps'
        ];
        
        if (existingEmails.includes(email.trim().toLowerCase())) {
          setSession(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'هذا البريد الإلكتروني مسجل مسبقاً' 
          }));
          
          logger.warn('Mock signup failed - email already exists', { email }, 'useAuth');
          
          return {
            success: false,
            error: { message: 'هذا البريد الإلكتروني مسجل مسبقاً' }
          };
        }
        
        // Create mock user
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone?.trim() || '+970123456789',
          is_business_verified: false,
          email_notifications: true,
          sms_notifications: !!phone,
          marketing_emails: receiveNewsletter,
          profile_visibility: 'public' as const,
          language: 'ar' as const,
          email_verified: true,
          phone_verified: !!phone,
          account_status: 'active' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as User;
        
        // Update session state
        setSession({
          user: mockUser,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        
        logger.info('Mock signup successful', { email }, 'useAuth');
        
        return {
          success: true,
          user: mockUser
        };
      }
      
      // REAL SUPABASE SIGNUP (Production)
      logger.debug('Using Supabase signup', { email }, 'useAuth');
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone?.trim() || null,
            marketing_emails: receiveNewsletter,
          },
        },
      });

      if (error) {
        setSession(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: getErrorMessage(error.message) 
        }));
        
        logger.warn('Signup failed', { error: error.message }, 'useAuth');

        return {
          success: false,
          error: { code: error.message, message: getErrorMessage(error.message) }
        };
      }

      // Update profile with additional fields
      if (data.user) {
        try {
          await supabase
            .from('profiles')
            .update({
              email_notifications: true,
              sms_notifications: !!phone,
              marketing_emails: receiveNewsletter,
              profile_visibility: 'public',
              language: 'ar',
              account_status: 'active',
            })
            .eq('id', data.user.id);
            
          logger.info('Profile updated after signup', { userId: data.user.id }, 'useAuth');
        } catch (profileError) {
          logger.error('Profile update error after signup', profileError, 'useAuth');
          // Don't fail signup for profile update errors
        }
      }
      
      logger.info('Signup successful', { userId: data.user?.id }, 'useAuth');

      return { success: true, user: data.user as unknown as User };

    } catch (error: any) {
      // Handle unexpected errors
      const errorMessage = 'حدث خطأ غير متوقع أثناء إنشاء الحساب';
      
      logger.error('Signup error', error, 'useAuth');
      
      setSession(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));

      return {
        success: false,
        error: { message: errorMessage }
      };
    }
  }, []);

  /**
   * Logout method
   * Signs out the current user and clears session data
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      logger.debug('Attempting to sign out user', null, 'useAuth');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear stored data
      localStorage.removeItem('yalla-souq-last-login');
      // Keep remember email if it exists
      
      logger.info('User signed out successfully', null, 'useAuth');
    } catch (error) {
      logger.error('Logout error', error, 'useAuth');
    }
  }, []);

  /**
   * Update user profile
   * Updates the current user's profile information
   */
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<AuthResponse> => {
    if (!session.user) {
      logger.warn('Update profile attempted without authentication', null, 'useAuth');
      return { success: false, error: { message: 'لم يتم تسجيل الدخول' } };
    }

    try {
      logger.debug('Updating user profile', { userId: session.user.id }, 'useAuth');
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', session.user.id);

      if (error) {
        logger.error('Profile update error', error, 'useAuth');
        return { 
          success: false, 
          error: { message: getErrorMessage(error.message) } 
        };
      }

      // Update local session
      setSession(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
      }));
      
      logger.info('Profile updated successfully', { userId: session.user.id }, 'useAuth');

      return { success: true };

    } catch (error: any) {
      logger.error('Profile update error', error, 'useAuth');
      return { 
        success: false, 
        error: { message: 'فشل في تحديث البيانات' } 
      };
    }
  }, [session.user]);

  /**
   * Reset password
   * Sends a password reset email to the specified address
   */
  const resetPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      logger.debug('Requesting password reset', { email }, 'useAuth');
      
      // Request password reset from Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        logger.error('Password reset request error', error, 'useAuth');
        return { 
          success: false, 
          error: { message: getErrorMessage(error.message) } 
        };
      }
      
      logger.info('Password reset email sent', { email }, 'useAuth');

      return { success: true };

    } catch (error: any) {
      logger.error('Password reset error', error, 'useAuth');
      return { 
        success: false, 
        error: { message: 'فشل في إرسال رابط إعادة تعيين كلمة المرور' } 
      };
    }
  }, []);

  /**
   * Check if user has specific permission
   * Determines if the current user has access to specific features
   */
  const hasPermission = useCallback((permission: string): boolean => {
    if (!session.user) return false;

    switch (permission) {
      case 'post_ad':
        return session.user.account_status === 'active';
      case 'business_features':
        return session.user.is_business_verified;
      case 'admin_panel':
        return session.user.email === 'admin@yallasouq.ps';
      default:
        return false;
    }
  }, [session.user]);

  /**
   * Get user display name
   * Returns formatted user name for display
   */
  const getDisplayName = useCallback((): string => {
    if (!session.user) return '';

    const { first_name, last_name, email } = session.user;
    
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    } else if (first_name) {
      return first_name;
    } else {
      return email.split('@')[0];
    }
  }, [session.user]);

  /**
   * Convert Supabase errors to Arabic messages
   * Provides user-friendly error messages in Arabic
   */
  const getErrorMessage = (error: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'بيانات تسجيل الدخول غير صحيحة',
      'User already registered': 'هذا البريد الإلكتروني مسجل مسبقاً',
      'Password should be at least 6 characters': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      'Invalid email': 'البريد الإلكتروني غير صحيح',
      'Email not confirmed': 'يرجى تأكيد البريد الإلكتروني أولاً',
      'Too many requests': 'محاولات كثيرة، يرجى المحاولة لاحقاً',
      'Network error': 'خطأ في الاتصال، تحقق من الإنترنت',
    };

    return errorMap[error] || error;
  };

  // Return authentication state and methods
  return {
    // Session state
    session,
    user: session.user,
    isLoading: session.isLoading,
    isAuthenticated: session.isAuthenticated,
    error: session.error,

    // Authentication methods
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,

    // Utility methods
    hasPermission,
    getDisplayName,

    // Security state
    loginAttempts,
    isBlocked,
  };
};

// Export types and hook
export type { User, AuthSession, LoginCredentials, SignupData, AuthResponse };
export default useAuth;