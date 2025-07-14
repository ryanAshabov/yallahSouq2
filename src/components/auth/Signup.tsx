/**
 * Signup Component - Yalla Souq Palestinian Marketplace
 * 
 * This component handles new user registration with comprehensive form validation,
 * password strength checking, and integration with the authentication system.
 */
import React, { useState, useCallback } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  AlertCircle, 
  CheckCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

// Form data interface
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  receiveNewsletter: boolean;
}

// Error interface
interface SignupError {
  field?: keyof SignupFormData | 'general';
  message: string;
}

// Password strength interface
interface PasswordStrength {
  score: number;
  feedback: string[];
  color: 'red' | 'orange' | 'yellow' | 'green';
}

// Component props
interface SignupProps {
  onSuccess?: (user: any) => void;
  onLoginRedirect?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSuccess, onLoginRedirect }) => {
  // Get signup method from useAuth hook
  const { signup } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    receiveNewsletter: true
  });
  
  // UI state
  const [errors, setErrors] = useState<SignupError[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'red'
  });

  /**
   * Calculate password strength
   * Evaluates password strength based on length, character types, and complexity
   */
  const calculatePasswordStrength = useCallback((password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, feedback: [], color: 'red' };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('استخدم 8 أحرف على الأقل');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('أضف حرف كبير');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('أضف حرف صغير');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('أضف رقم');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('أضف رمز خاص (!@#$...)');
    }

    // Determine color based on score
    const colors: Record<number, 'red' | 'orange' | 'yellow' | 'green'> = {
      0: 'red', 1: 'red', 2: 'orange', 3: 'yellow', 4: 'green', 5: 'green'
    };

    return {
      score: Math.max(0, Math.min(4, score)),
      feedback,
      color: colors[Math.max(0, Math.min(4, score))]
    };
  }, []);

  /**
   * Form validation
   * Validates all form fields and returns true if valid
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: SignupError[] = [];
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.push({ field: 'firstName', message: 'الاسم الأول مطلوب' });
    } else if (formData.firstName.length < 2) {
      newErrors.push({ field: 'firstName', message: 'الاسم الأول يجب أن يكون حرفين على الأقل' });
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.push({ field: 'lastName', message: 'الاسم الأخير مطلوب' });
    } else if (formData.lastName.length < 2) {
      newErrors.push({ field: 'lastName', message: 'الاسم الأخير يجب أن يكون حرفين على الأقل' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: 'البريد الإلكتروني مطلوب' });
    } else if (!emailRegex.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'صيغة البريد الإلكتروني غير صحيحة' });
    }
    
    // Phone validation (Palestinian numbers)
    if (formData.phone) {
      const phoneRegex = /^(\+970|0)?[5-9]\d{8}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.push({ field: 'phone', message: 'رقم هاتف فلسطيني صحيح مطلوب (مثال: 0599123456)' });
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.push({ field: 'password', message: 'كلمة المرور مطلوبة' });
    } else if (passwordStrength.score < 3) {
      newErrors.push({ field: 'password', message: 'كلمة المرور ضعيفة جداً، يرجى تحسينها' });
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.push({ field: 'confirmPassword', message: 'تأكيد كلمة المرور مطلوب' });
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.push({ field: 'confirmPassword', message: 'كلمتا المرور غير متطابقتين' });
    }
    
    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.push({ field: 'acceptTerms', message: 'يجب قبول الشروط والأحكام للمتابعة' });
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [formData, passwordStrength]);

  /**
   * Handle input changes
   * Updates form state and clears related errors
   */
  const handleInputChange = useCallback((field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
    setSuccessMessage('');
    
    // Update password strength if password field
    if (field === 'password' && typeof value === 'string') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  }, [calculatePasswordStrength]);

  /**
   * Form submission handler
   * Validates form and calls signup method from useAuth hook
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      logger.debug('Signup form validation failed', null, 'Signup');
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage('');
    
    try {
      logger.info('Attempting to create new account', { email: formData.email }, 'Signup');
      
      // Call signup method from useAuth hook
      const result = await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        acceptTerms: formData.acceptTerms,
        receiveNewsletter: formData.receiveNewsletter
      });

      // Handle signup success
      if (result.success) {
        logger.info('Account created successfully', { userId: result.user?.id }, 'Signup');
        
        // Show success message
        setSuccessMessage('تم إنشاء الحساب بنجاح! 🎉');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false,
          receiveNewsletter: true
        });
        
        // Call success callback
        if (onSuccess && result.user) {
          onSuccess(result.user);
        }
      } 
      // Handle signup failure
      else {
        const errorMessage = result.error?.message || 'فشل في إنشاء الحساب';
        logger.warn('Account creation failed', { error: errorMessage }, 'Signup');
        
        if (result.error?.message?.includes('already registered')) {
          setErrors([{ field: 'email', message: 'هذا البريد الإلكتروني مسجل مسبقاً' }]);
        } else {
          setErrors([{ field: 'general', message: errorMessage }]);
        }
      }
    } catch (error: any) {
      // Handle unexpected errors
      logger.error('Signup error', error, 'Signup');
      setErrors([{ field: 'general', message: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' }]);
    } finally {
      // Clear loading state
      setIsSubmitting(false);
    }
  }, [formData, validateForm, signup, onSuccess]);

  /**
   * Get error message for specific field
   */
  const getFieldError = useCallback((field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  }, [errors]);

  /**
   * Get general error messages
   */
  const getGeneralErrors = useCallback((): string[] => {
    return errors
      .filter(error => error.field === 'general')
      .map(error => error.message);
  }, [errors]);

  /**
   * Password strength indicator component
   * Shows visual feedback about password strength
   */
  const PasswordStrengthIndicator: React.FC = () => (
    <div className="mt-2">
      <div className="flex space-x-1 space-x-reverse mb-2">
        {[0, 1, 2, 3, 4].map(index => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index <= passwordStrength.score
                ? passwordStrength.color === 'red' ? 'bg-red-500'
                : passwordStrength.color === 'orange' ? 'bg-orange-500'
                : passwordStrength.color === 'yellow' ? 'bg-yellow-500'
                : 'bg-green-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {passwordStrength.feedback.length > 0 && (
        <div className="text-xs text-gray-600">
          <p>لتحسين قوة كلمة المرور:</p>
          <ul className="list-disc list-inside mt-1">
            {passwordStrength.feedback.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛒 يلا سوق الفلسطيني
          </h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-6">
            إنشاء حساب جديد
          </h2>
          <p className="text-sm text-gray-600">
            انضم إلى أكبر سوق إلكتروني للمنتجات الفلسطينية
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الأول
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className={`
                      appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 sm:text-sm transition-colors duration-200
                      ${getFieldError('firstName') ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="أحمد"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                {getFieldError('firstName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 ml-1" />
                    {getFieldError('firstName')}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الأخير
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className={`
                      appearance-none block w-full px-3 py-2 border rounded-md shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 sm:text-sm transition-colors duration-200
                      ${getFieldError('lastName') ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="محمد"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                {getFieldError('lastName') && (
                  <p className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 ml-1" />
                    {getFieldError('lastName')}
                  </p>
                )}
              </div>
            </div>

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
                  placeholder="ahmed@example.com"
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

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف (اختياري)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  dir="ltr"
                  className={`
                    appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 sm:text-sm transition-colors duration-200
                    ${getFieldError('phone') ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  placeholder="0599123456"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {getFieldError('phone') && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  {getFieldError('phone')}
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
                  autoComplete="new-password"
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
              {formData.password && <PasswordStrengthIndicator />}
              {getFieldError('password') && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  {getFieldError('password')}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`
                    appearance-none block w-full px-3 py-2 pr-10 pl-10 border rounded-md shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 sm:text-sm transition-colors duration-200
                    ${getFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-xs text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 ml-1" />
                  كلمتا المرور متطابقتان
                </p>
              )}
              {getFieldError('confirmPassword') && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  {getFieldError('confirmPassword')}
                </p>
              )}
            </div>

            {/* Terms and Newsletter */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="acceptTerms" className="mr-3 block text-sm text-gray-700">
                  أوافق على{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    الشروط والأحكام
                  </a>
                  {' '}و{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    سياسة الخصوصية
                  </a>
                </label>
              </div>
              {getFieldError('acceptTerms') && (
                <p className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 ml-1" />
                  {getFieldError('acceptTerms')}
                </p>
              )}

              <div className="flex items-start">
                <input
                  id="receiveNewsletter"
                  name="receiveNewsletter"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  checked={formData.receiveNewsletter}
                  onChange={(e) => handleInputChange('receiveNewsletter', e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="receiveNewsletter" className="mr-3 block text-sm text-gray-700">
                  أريد استلام النشرة الإخبارية والعروض الخاصة
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !formData.acceptTerms}
                className={`
                  group relative w-full flex justify-center py-3 px-4 border border-transparent 
                  text-sm font-medium rounded-md text-white transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${isSubmitting || !formData.acceptTerms
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-3 rounded-full border-b-2 border-white"></span>
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  'إنشاء حساب جديد'
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                تملك حساباً بالفعل؟{' '}
                <button
                  type="button"
                  onClick={onLoginRedirect}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  disabled={isSubmitting}
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;