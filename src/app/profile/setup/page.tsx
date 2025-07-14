'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

/**
 * Profile Setup Page - Yalla Souq Palestinian Marketplace
 * 
 * This page handles the initial profile setup for new users after registration.
 * It collects essential user information to complete their profile and enhance
 * their marketplace experience.
 */
const ProfileSetupPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    region: '',
    bio: '',
    isBusinessAccount: false,
    businessName: '',
    businessType: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Palestinian regions for dropdown
  const palestinianRegions = [
    { value: '', label: 'اختر المحافظة' },
    { value: 'jerusalem', label: 'القدس' },
    { value: 'ramallah', label: 'رام الله والبيرة' },
    { value: 'bethlehem', label: 'بيت لحم' },
    { value: 'hebron', label: 'الخليل' },
    { value: 'nablus', label: 'نابلس' },
    { value: 'jenin', label: 'جنين' },
    { value: 'tulkarm', label: 'طولكرم' },
    { value: 'qalqilya', label: 'قلقيلية' },
    { value: 'salfit', label: 'سلفيت' },
    { value: 'jericho', label: 'أريحا والأغوار' },
    { value: 'tubas', label: 'طوباس والأغوار الشمالية' },
    { value: 'gaza', label: 'غزة' },
    { value: 'north-gaza', label: 'شمال غزة' },
    { value: 'deir-al-balah', label: 'دير البلح' },
    { value: 'khan-younis', label: 'خان يونس' },
    { value: 'rafah', label: 'رفح' }
  ];

  // Business types
  const businessTypes = [
    { value: '', label: 'اختر نوع النشاط التجاري' },
    { value: 'retail', label: 'تجارة التجزئة' },
    { value: 'wholesale', label: 'تجارة الجملة' },
    { value: 'manufacturing', label: 'تصنيع' },
    { value: 'services', label: 'خدمات' },
    { value: 'food', label: 'مطاعم وأغذية' },
    { value: 'tech', label: 'تكنولوجيا ومعلومات' },
    { value: 'construction', label: 'بناء ومقاولات' },
    { value: 'agriculture', label: 'زراعة' },
    { value: 'other', label: 'أخرى' }
  ];

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile/setup');
    } else if (user) {
      // Pre-fill form with existing user data if available
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        city: user.address_city || '',
        region: user.address_region || '',
        bio: user.bio || '',
        isBusinessAccount: !!user.business_name,
        businessName: user.business_name || '',
        businessType: user.business_type || '',
      }));
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form
      if (!formData.firstName || !formData.lastName) {
        throw new Error('الاسم الأول واسم العائلة مطلوبان');
      }

      if (formData.isBusinessAccount && !formData.businessName) {
        throw new Error('اسم النشاط التجاري مطلوب للحسابات التجارية');
      }

      // Prepare profile updates
      const profileUpdates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone || null,
        address_city: formData.city || null,
        address_region: formData.region || null,
        bio: formData.bio || null,
        business_name: formData.isBusinessAccount ? formData.businessName : null,
        business_type: formData.isBusinessAccount ? formData.businessType : null,
        updated_at: new Date().toISOString()
      };

      // Update profile using useAuth hook
      if (updateProfile) {
        const result = await updateProfile(profileUpdates);
        
        if (!result.success) {
          throw new Error(result.error?.message || 'فشل في تحديث الملف الشخصي');
        }
        
        setSuccess('تم تحديث الملف الشخصي بنجاح!');
        
        // Redirect to dashboard after successful setup
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      logger.error('Profile setup error', error, 'ProfileSetup');
      setError(error.message || 'حدث خطأ أثناء إعداد الملف الشخصي');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إكمال الملف الشخصي</h1>
            <p className="text-gray-600">
              أهلاً بك في يلا سوق الفلسطيني! يرجى إكمال معلومات ملفك الشخصي للاستفادة من جميع ميزات المنصة.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <span className="text-red-600 ml-2">⚠️</span>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <span className="text-green-600 ml-2">✅</span>
                <div className="text-sm text-green-700">{success}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الأول *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم العائلة *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="059xxxxxxx"
                  />
                </div>

                {/* Region */}
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                    المحافظة
                  </label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {palestinianRegions.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="md:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    المدينة/البلدة
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: رام الله"
                  />
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    نبذة شخصية
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب نبذة قصيرة عن نفسك..."
                  />
                </div>
              </div>
            </div>

            {/* Business Account */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isBusinessAccount"
                  name="isBusinessAccount"
                  checked={formData.isBusinessAccount}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isBusinessAccount" className="mr-2 block text-lg font-medium text-gray-900">
                  حساب تجاري
                </label>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                الحسابات التجارية تحصل على ميزات إضافية مثل شارة التوثيق، وإمكانية نشر إعلانات متعددة، وإحصاءات مفصلة.
              </p>

              {formData.isBusinessAccount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      اسم النشاط التجاري *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={formData.isBusinessAccount}
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                      نوع النشاط التجاري
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {businessTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                  hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ الملف الشخصي'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;