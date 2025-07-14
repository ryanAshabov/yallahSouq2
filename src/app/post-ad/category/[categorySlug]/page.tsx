/**
 * SelectAdTypePage Component - Ad Type Selection Interface
 * 
 * This component represents the second step in the ad creation workflow for the
 * Palestinian marketplace. It allows users to select specific advertisement types
 * within their chosen category, providing a comprehensive interface for different
 * transaction types and specialized subcategories.
 * 
 * Key Features:
 * - Dynamic ad type options based on selected category
 * - Hierarchical subcategory selection for detailed classification
 * - Progress tracking with visual step indicators
 * - Authentication verification and redirection
 * - Responsive design with RTL (Right-to-Left) support
 * - Palestinian market-specific transaction types
 * 
 * Workflow Integration:
 * - Step 1: Category selection (previous page)
 * - Step 2: Ad type selection (current page)
 * - Step 3: Details and images (next page)
 * 
 * Supported Transaction Types:
 * - SELL: Items or properties for sale
 * - BUY: Wanted/seeking advertisements
 * - RENT: Rental listings and services
 * - SERVICE: Professional services and repairs
 * - JOB: Employment opportunities
 * 
 * Category-Specific Features:
 * - Vehicles: Cars, motorcycles, trucks, parts, services
 * - Real Estate: Properties, apartments, houses, commercial spaces
 * - Electronics: Phones, computers, gaming, repair services
 * - Fashion: Clothing, shoes, accessories, jewelry
 * - Fallback: Generic options for other categories
 * 
 * State Management:
 * - Authentication status tracking
 * - Category data loading and validation
 * - Loading states for better user experience
 * - Error handling for failed operations
 * 
 * Security Features:
 * - Authentication requirement enforcement
 * - Automatic login redirection for unauthorized users
 * - Session validation with Supabase integration
 * 
 * Technical Architecture:
 * - Next.js App Router with dynamic routing
 * - TypeScript for type safety
 * - Supabase authentication integration
 * - Custom hooks for category management
 * - Responsive Tailwind CSS styling
 * 
 * @component SelectAdTypePage
 * @route /post-ad/category/[categorySlug]
 * @param {AdTypePageProps} props - Component props containing route parameters
 * @returns {JSX.Element} Rendered ad type selection interface
 * 
 * @author Yalla Souq Development Team
 * @version 2.1.0
 * @since 1.0.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCategories } from '@/hooks/useCategories';

/**
 * Component Props Interface
 * 
 * Defines the expected props structure for the SelectAdTypePage component.
 * Uses Next.js dynamic route parameters to extract category information.
 * 
 * @interface AdTypePageProps
 */
interface AdTypePageProps {
  /** Route parameters containing dynamic category slug */
  params: {
    /** URL-friendly category identifier used for routing and data lookup */
    categorySlug: string;
  };
}

/**
 * Advertisement Type Option Interface
 * 
 * Represents a complete ad type configuration with optional subcategories.
 * This structure supports both simple ad types and complex hierarchical
 * classifications for detailed marketplace organization.
 * 
 * @interface AdTypeOption
 */
interface AdTypeOption {
  /** Primary transaction type identifier */
  type: 'sell' | 'buy' | 'rent' | 'service' | 'job';
  /** Arabic title for the ad type (primary language) */
  title: string;
  /** Descriptive explanation of the ad type purpose */
  description: string;
  /** Unicode emoji icon for visual identification */
  icon: string;
  /** Optional subcategories for detailed classification */
  subTypes?: {
    /** Unique identifier for the subcategory */
    id: string;
    /** Arabic title for the subcategory */
    title: string;
    /** Unicode emoji icon for the subcategory */
    icon: string;
    /** Brief description of the subcategory */
    description: string;
  }[];
}

const SelectAdTypePage: React.FC<AdTypePageProps> = ({ params }) => {
  // Hooks and navigation setup
  const router = useRouter();
  const { getCategoryBySlug } = useCategories();
  
  // Component state management
  /** Currently selected category data */
  const [category, setCategory] = useState<any>(null);
  /** User authentication status */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  /** Authentication check loading state */
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  /** Category data loading state */
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Authentication Verification Effect
   * 
   * Checks user authentication status on component mount using Supabase.
   * This ensures only authenticated users can access the ad creation flow.
   * 
   * Process:
   * 1. Retrieve current session from Supabase
   * 2. Update authentication state based on session existence
   * 3. Handle any authentication errors gracefully
   * 4. Clear loading state regardless of outcome
   */
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Category Data Loading Effect
   * 
   * Loads category information based on the slug parameter from the URL.
   * This effect runs when the component mounts or when the category slug changes.
   * 
   * Process:
   * 1. Extract category slug from route parameters
   * 2. Call category service to fetch detailed information
   * 3. Update component state with category data
   * 4. Clear loading state when operation completes
   */
  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      if (params.categorySlug) {
        const categoryData = await getCategoryBySlug(params.categorySlug);
        setCategory(categoryData);
        setLoading(false);
      }
    };

    loadCategory();
  }, [params.categorySlug, getCategoryBySlug]);

  /**
   * Authentication Redirection Effect
   * 
   * Handles automatic redirection for unauthenticated users to the login page.
   * Includes a redirect parameter to return users to this page after successful login.
   * 
   * Security Features:
   * - Prevents unauthorized access to ad creation flow
   * - Preserves user intent with redirect parameters
   * - Runs only after authentication status is determined
   */
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/post-ad');
    }
  }, [authLoading, isLoggedIn, router]);

  /**
   * Dynamic Ad Type Options Generator
   * 
   * Generates appropriate advertisement type options based on the selected category.
   * This function provides category-specific transaction types and subcategories
   * tailored to Palestinian marketplace needs.
   * 
   * Supported Categories:
   * - vehicles: Cars, motorcycles, trucks, parts, services
   * - real-estate: Properties, apartments, commercial spaces
   * - electronics: Phones, computers, gaming devices, repairs
   * - fashion: Clothing, shoes, accessories, jewelry
   * - default: Generic options for other categories
   * 
   * @param {string} categorySlug - URL-friendly category identifier
   * @returns {AdTypeOption[]} Array of available ad type options for the category
   * 
   * @example
   * const vehicleOptions = getAdTypeOptions('vehicles');
   * // Returns: [sell cars, rent vehicles, wanted vehicles, car services]
   */
  // Get ad type options based on category
  const getAdTypeOptions = (categorySlug: string): AdTypeOption[] => {
    switch (categorySlug) {
      case 'vehicles':
        return [
          {
            type: 'sell',
            title: 'بيع مركبة',
            description: 'بيع سيارة، دراجة نارية، أو أي مركبة',
            icon: '🚗',
            subTypes: [
              { id: 'car_sell', title: 'بيع سيارة', icon: '🚗', description: 'سيارات خاصة للبيع' },
              { id: 'motorcycle_sell', title: 'بيع دراجة نارية', icon: '🏍️', description: 'دراجات نارية للبيع' },
              { id: 'truck_sell', title: 'بيع شاحنة', icon: '🚛', description: 'شاحنات وآليات ثقيلة' },
              { id: 'parts_sell', title: 'بيع قطع غيار', icon: '🔧', description: 'قطع غيار ومستلزمات' }
            ]
          },
          {
            type: 'rent',
            title: 'تأجير مركبة',
            description: 'تأجير سيارة، باص، أو أي مركبة',
            icon: '🚕',
            subTypes: [
              { id: 'car_rent', title: 'تأجير سيارة', icon: '🚕', description: 'سيارات للإيجار اليومي أو الشهري' },
              { id: 'bus_rent', title: 'تأجير باص', icon: '🚌', description: 'باصات للرحلات والمناسبات' },
              { id: 'truck_rent', title: 'تأجير شاحنة', icon: '🚛', description: 'شاحنات للنقل والشحن' }
            ]
          },
          {
            type: 'buy',
            title: 'مطلوب للشراء',
            description: 'البحث عن مركبة للشراء',
            icon: '🔍',
            subTypes: [
              { id: 'car_buy', title: 'مطلوب سيارة', icon: '🚗', description: 'البحث عن سيارة للشراء' },
              { id: 'motorcycle_buy', title: 'مطلوب دراجة نارية', icon: '🏍️', description: 'البحث عن دراجة نارية' }
            ]
          },
          {
            type: 'service',
            title: 'خدمات السيارات',
            description: 'خدمات صيانة وإصلاح',
            icon: '🔧',
            subTypes: [
              { id: 'repair_service', title: 'خدمة إصلاح', icon: '🔧', description: 'خدمات إصلاح وصيانة' },
              { id: 'wash_service', title: 'خدمة غسيل', icon: '🚿', description: 'خدمات غسيل وتنظيف' },
              { id: 'towing_service', title: 'خدمة سحب', icon: '🚗', description: 'خدمات سحب المركبات' }
            ]
          }
        ];

      case 'real-estate':
        return [
          {
            type: 'sell',
            title: 'بيع عقار',
            description: 'بيع شقة، منزل، أرض أو محل',
            icon: '🏠',
            subTypes: [
              { id: 'apartment_sell', title: 'بيع شقة', icon: '🏢', description: 'شقق سكنية للبيع' },
              { id: 'house_sell', title: 'بيع منزل', icon: '🏠', description: 'منازل وفلل للبيع' },
              { id: 'land_sell', title: 'بيع أرض', icon: '🌍', description: 'أراضي للبيع' },
              { id: 'shop_sell', title: 'بيع محل تجاري', icon: '🏪', description: 'محلات ومكاتب تجارية' }
            ]
          },
          {
            type: 'rent',
            title: 'تأجير عقار',
            description: 'تأجير شقة، منزل، مكتب أو محل',
            icon: '🏘️',
            subTypes: [
              { id: 'apartment_rent', title: 'تأجير شقة', icon: '🏢', description: 'شقق سكنية للإيجار' },
              { id: 'house_rent', title: 'تأجير منزل', icon: '🏠', description: 'منازل وفلل للإيجار' },
              { id: 'office_rent', title: 'تأجير مكتب', icon: '🏢', description: 'مكاتب للإيجار' },
              { id: 'shop_rent', title: 'تأجير محل', icon: '🏪', description: 'محلات تجارية للإيجار' }
            ]
          },
          {
            type: 'buy',
            title: 'مطلوب للشراء',
            description: 'البحث عن عقار للشراء',
            icon: '🔍',
            subTypes: [
              { id: 'property_buy', title: 'مطلوب عقار', icon: '🏠', description: 'البحث عن عقار للشراء' }
            ]
          }
        ];

      case 'electronics':
        return [
          {
            type: 'sell',
            title: 'بيع جهاز إلكتروني',
            description: 'بيع هاتف، حاسوب، أو أي جهاز إلكتروني',
            icon: '📱',
            subTypes: [
              { id: 'phone_sell', title: 'بيع هاتف', icon: '📱', description: 'هواتف ذكية وعادية' },
              { id: 'laptop_sell', title: 'بيع حاسوب محمول', icon: '💻', description: 'حواسيب محمولة للبيع' },
              { id: 'tv_sell', title: 'بيع تلفزيون', icon: '📺', description: 'أجهزة تلفزيون وشاشات' },
              { id: 'gaming_sell', title: 'بيع ألعاب وأجهزة', icon: '🎮', description: 'أجهزة ألعاب ومستلزماتها' }
            ]
          },
          {
            type: 'buy',
            title: 'مطلوب للشراء',
            description: 'البحث عن جهاز إلكتروني',
            icon: '🔍',
            subTypes: [
              { id: 'electronics_buy', title: 'مطلوب جهاز', icon: '📱', description: 'البحث عن أجهزة إلكترونية' }
            ]
          },
          {
            type: 'service',
            title: 'خدمات إلكترونية',
            description: 'إصلاح وصيانة الأجهزة',
            icon: '🔧',
            subTypes: [
              { id: 'repair_electronics', title: 'إصلاح الأجهزة', icon: '🔧', description: 'خدمات إصلاح وصيانة' }
            ]
          }
        ];

      case 'fashion':
        return [
          {
            type: 'sell',
            title: 'بيع ملابس وإكسسوارات',
            description: 'بيع ملابس، أحذية، حقائب وإكسسوارات',
            icon: '👕',
            subTypes: [
              { id: 'clothes_sell', title: 'بيع ملابس', icon: '👕', description: 'ملابس للرجال والنساء والأطفال' },
              { id: 'shoes_sell', title: 'بيع أحذية', icon: '👟', description: 'أحذية رياضية وكلاسيكية' },
              { id: 'bags_sell', title: 'بيع حقائب', icon: '👜', description: 'حقائب وحقائب ظهر' },
              { id: 'accessories_sell', title: 'بيع إكسسوارات', icon: '💍', description: 'مجوهرات وإكسسوارات' }
            ]
          },
          {
            type: 'buy',
            title: 'مطلوب للشراء',
            description: 'البحث عن ملابس وإكسسوارات',
            icon: '🔍',
            subTypes: [
              { id: 'fashion_buy', title: 'مطلوب ملابس', icon: '👕', description: 'البحث عن ملابس وإكسسوارات' }
            ]
          }
        ];

      default:
        /**
         * Default Ad Type Options
         * 
         * Fallback options for categories that don't have specific configurations.
         * Provides basic transaction types suitable for general marketplace items.
         */
        return [
          {
            type: 'sell',
            title: 'للبيع',
            description: 'بيع منتج في هذه الفئة',
            icon: '💰',
          },
          {
            type: 'buy',
            title: 'مطلوب للشراء',
            description: 'البحث عن منتج في هذه الفئة',
            icon: '🔍',
          },
          {
            type: 'service',
            title: 'خدمة',
            description: 'تقديم خدمة في هذه الفئة',
            icon: '🔧',
          }
        ];
    }
  };

  /**
   * Ad Type Selection Handler
   * 
   * Processes user selection of ad type and optional subtype, then navigates
   * to the next step in the ad creation workflow. Constructs URL parameters
   * to maintain state across the multi-step process.
   * 
   * @param {AdTypeOption} adType - Selected primary ad type (sell, buy, rent, etc.)
   * @param {any} [subType] - Optional selected subcategory for detailed classification
   * 
   * Navigation Flow:
   * 1. Collect selection data (category, type, subtype)
   * 2. Construct URL parameters for state preservation
   * 3. Navigate to ad details form (step 3)
   * 
   * @example
   * // Basic type selection
   * handleAdTypeSelect({ type: 'sell', title: 'للبيع', ... });
   * 
   * // With subtype selection
   * handleAdTypeSelect(sellType, { id: 'car_sell', title: 'بيع سيارة', ... });
   */
  // Handle ad type selection
  const handleAdTypeSelect = (adType: AdTypeOption, subType?: any) => {
    const params = new URLSearchParams({
      category: category.id,
      type: adType.type,
      ...(subType && { subType: subType.id })
    });
    
    router.push(`/post-ad/details?${params.toString()}`);
  };

  /**
   * Loading State Render
   * 
   * Displays a loading spinner and message while authentication or category
   * data is being fetched. Provides visual feedback for better user experience.
   */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الخيارات...</p>
        </div>
      </div>
    );
  }

  /**
   * Authentication Guard
   * 
   * Prevents rendering of the component when user is not authenticated
   * or when category data is unavailable. Returns null to render nothing.
   */
  if (!isLoggedIn || !category) {
    return null;
  }

  // Generate ad type options for the current category
  const adTypeOptions = getAdTypeOptions(category.slug);

  /**
   * Main Component Render
   * 
   * Renders the complete ad type selection interface including:
   * - Header with navigation and progress tracking
   * - Hero section with category information
   * - Ad type options grid with subcategories
   * - Help section with guidance for users
   */

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/post-ad" className="text-green-600 hover:text-green-700">
                ← رجوع للفئات
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {category.icon} {category.name}
                </h1>
                <p className="text-gray-600 text-sm">الخطوة 2 من 3: اختر نوع الإعلان</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="hidden md:flex items-center space-x-2 space-x-reverse">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">✓</div>
                <span className="mr-2 text-sm text-green-600 font-medium">اختر الفئة</span>
              </div>
              <div className="w-16 h-px bg-green-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <span className="mr-2 text-sm text-green-600 font-medium">نوع الإعلان</span>
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <span className="mr-2 text-sm text-gray-500">التفاصيل والصور</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ما نوع إعلان {category.name}؟
          </h2>
          <p className="text-xl text-green-100">
            اختر نوع الإعلان المناسب لما تريد تحقيقه
          </p>
        </div>
      </div>

      {/* Ad Type Options */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adTypeOptions.map((adType) => (
              <div key={adType.type} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Main Ad Type Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4 space-x-reverse mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-2xl text-white shadow-lg">
                      {adType.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{adType.title}</h3>
                      <p className="text-gray-600 text-sm">{adType.description}</p>
                    </div>
                  </div>
                </div>

                {/* Sub Types */}
                <div className="p-4">
                  {adType.subTypes ? (
                    <div className="space-y-2">
                      {adType.subTypes.map((subType) => (
                        <button
                          key={subType.id}
                          onClick={() => handleAdTypeSelect(adType, subType)}
                          className="w-full text-right p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                        >
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <span className="text-2xl">{subType.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-green-700">
                                {subType.title}
                              </h4>
                              <p className="text-sm text-gray-600">{subType.description}</p>
                            </div>
                            <span className="text-green-600 group-hover:text-green-700">←</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdTypeSelect(adType)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      اختر هذا النوع
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💡 لست متأكداً من النوع المناسب؟</h3>
          <p className="text-gray-600 mb-6">
            لا تقلق! يمكنك دائماً تعديل نوع الإعلان لاحقاً من لوحة التحكم الخاصة بك
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <span className="text-green-600">💰</span>
              <span className="text-gray-700">للبيع: لبيع منتج تملكه</span>
            </div>
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <span className="text-blue-600">🔍</span>
              <span className="text-gray-700">مطلوب: للبحث عن منتج تريد شراءه</span>
            </div>
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <span className="text-purple-600">🏠</span>
              <span className="text-gray-700">للإيجار: لتأجير منتج أو خدمة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAdTypePage;