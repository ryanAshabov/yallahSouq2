/**
 * Login Component - Yalla Souq Palestinian Marketplace
 * 
 * This component handles user authentication through email and password.
 * It provides a complete login form with validation, error handling,
 * and integration with the useAuth hook.
 */
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

// Props interface for the Login component
interface LoginProps {
  onSuccess?: (user: any) => void;
  onSignupRedirect?: () => void;
}

// Form data interface
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Error interface for validation
interface FormError {
  field?: 'email' | 'password' | 'general';
  message: string;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onSignupRedirect }) => {
  // Get authentication methods from useAuth hook
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // UI state
  const [errors, setErrors] = useState<FormError[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load saved email on component mount (for "remember me" feature)
  useEffect(() => {
    const savedEmail = localStorage.getItem('yalla-souq-remember-email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    // Update form data
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
    
    // Clear success message when user starts typing again
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: FormError[] = [];
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: 'البريد الإلكتروني مطلوب' });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.push({ field: 'email', message: 'صيغة البريد الإلكتروني غير صحيحة' });
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.push({ field: 'password', message: 'كلمة المرور مطلوبة' });
    }
    
    // Update errors state
    setErrors(newErrors);
    
    // Return true if no errors
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    setErrors([]);
    
    try {
      // Log authentication attempt
      logger.debug('Attempting login', { email: formData.email }, 'Login');
      
      // Call login method from useAuth hook
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      // Handle successful login
      if (result.success && result.user) {
        logger.info('Login successful', { userId: result.user.id }, 'Login');
        
        // Show success message
        setSuccessMessage('تم تسجيل الدخول بنجاح! 🎉');
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result.user);
        }
      } 
      // Handle login failure
      else {
        const errorMessage = result.error?.message || 'فشل تسجيل الدخول';
        logger.warn('Login failed', { error: errorMessage }, 'Login');
        
        setErrors([{ field: 'general', message: errorMessage }]);
      }
    } catch (error: any) {
      // Handle unexpected errors
      logger.error('Login error', error, 'Login');
      setErrors([{ 
        field: 'general', 
        message: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' 
      }]);
    } finally {
      // Clear loading state
      setIsSubmitting(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    // Validate email
    if (!formData.email) {
      setErrors([{ field: 'email', message: 'أدخل البريد الإلكتروني أولاً' }]);
      return;
    }
    
    // Show success message (in a real app, this would send a reset email)
    setSuccessMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
  };

  // Helper to get error for a specific field
  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  // Helper to get general errors
  const getGeneralErrors = (): string[] => {
    return errors
      .filter(error => error.field === 'general')
      .map(error => error.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛒 يلا سوق الفلسطيني
          </h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-6">
            تسجيل الدخول
          </h2>
          <p className="text-sm text-gray-600">
            مرحباً بك في السوق الإلكتروني للمنتجات الفلسطينية
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 ml-2" />
                <div className="text-sm text-green-700">{successMessage}</div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {getGeneralErrors().length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 ml-2" />
                <div className="text-sm text-red-700">
                  {getGeneralErrors().map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  dir="ltr"
                  className={`
                    appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 sm:text-sm transition-colors duration-200
                    ${getFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {getFieldError('email') && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`
                    appearance-none block w-full px-3 py-2 pr-10 pl-10 border rounded-md shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 sm:text-sm transition-colors duration-200
                    ${getFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  {getFieldError('password')}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700">
                  تذكرني
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  disabled={isSubmitting}
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  group relative w-full flex justify-center py-2 px-4 border border-transparent 
                  text-sm font-medium rounded-md text-white transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-3 rounded-full border-b-2 border-white"></span>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                لا تملك حساباً؟{' '}
                <button
                  type="button"
                  onClick={onSignupRedirect}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  disabled={isSubmitting}
                >
                  إنشاء حساب جديد
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;