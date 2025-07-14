/**
 * Mock Data Service - Professional mock data management
 * Provides realistic Palestinian marketplace data for development
 */

import { logger } from './logger';

// Types
export interface MockAd {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category_id: string;
  price?: number;
  currency: string;
  price_type: 'fixed' | 'negotiable' | 'free' | 'contact';
  city: string;
  region: string;
  status: 'active' | 'sold' | 'expired';
  ad_type: 'sell' | 'buy' | 'rent' | 'service' | 'job';
  condition_type?: 'new' | 'used' | 'refurbished';
  is_featured: boolean;
  is_urgent: boolean;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  contact_method: string[];
  views_count: number;
  favorites_count: number;
  messages_count: number;
  is_business_ad: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string;
  category?: MockCategory;
  user?: MockUser;
  images?: MockAdImage[];
  is_favorited?: boolean;
}

export interface MockCategory {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

export interface MockUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  is_business_verified: boolean;
  created_at: string;
}

export interface MockAdImage {
  id: string;
  ad_id: string;
  image_url: string;
  thumbnail_url?: string;
  is_primary: boolean;
  sort_order: number;
}

// Mock Categories Data
const mockCategories: MockCategory[] = [
  {
    id: '1',
    name: 'مركبات',
    name_en: 'Vehicles',
    slug: 'vehicles',
    icon: '🚗',
    color: 'bg-blue-500',
    sort_order: 1,
    is_active: true
  },
  {
    id: '2',
    name: 'عقارات',
    name_en: 'Real Estate',
    slug: 'real-estate',
    icon: '🏠',
    color: 'bg-green-500',
    sort_order: 2,
    is_active: true
  },
  {
    id: '3',
    name: 'إلكترونيات',
    name_en: 'Electronics',
    slug: 'electronics',
    icon: '📱',
    color: 'bg-purple-500',
    sort_order: 3,
    is_active: true
  },
  {
    id: '4',
    name: 'أزياء',
    name_en: 'Fashion',
    slug: 'fashion',
    icon: '👕',
    color: 'bg-pink-500',
    sort_order: 4,
    is_active: true
  },
  {
    id: '5',
    name: 'أثاث منزلي',
    name_en: 'Home & Furniture',
    slug: 'home-furniture',
    icon: '🏡',
    color: 'bg-orange-500',
    sort_order: 5,
    is_active: true
  },
  {
    id: '6',
    name: 'رياضة',
    name_en: 'Sports',
    slug: 'sports',
    icon: '⚽',
    color: 'bg-red-500',
    sort_order: 6,
    is_active: true
  },
  {
    id: '7',
    name: 'كتب',
    name_en: 'Books',
    slug: 'books',
    icon: '📚',
    color: 'bg-indigo-500',
    sort_order: 7,
    is_active: true
  },
  {
    id: '8',
    name: 'خدمات',
    name_en: 'Services',
    slug: 'services',
    icon: '🔧',
    color: 'bg-gray-500',
    sort_order: 8,
    is_active: true
  },
  {
    id: '9',
    name: 'وظائف',
    name_en: 'Jobs',
    slug: 'jobs',
    icon: '💼',
    color: 'bg-teal-500',
    sort_order: 9,
    is_active: true
  },
  {
    id: '10',
    name: 'أخرى',
    name_en: 'Other',
    slug: 'other',
    icon: '📦',
    color: 'bg-gray-400',
    sort_order: 10,
    is_active: true
  }
];

// Mock Users Data
const mockUsers: MockUser[] = [
  {
    id: '1',
    first_name: 'أحمد',
    last_name: 'محمد',
    is_business_verified: false,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    first_name: 'فاطمة',
    last_name: 'أحمد',
    is_business_verified: true,
    created_at: '2024-01-10T08:00:00Z'
  },
  {
    id: '3',
    first_name: 'محمد',
    last_name: 'خالد',
    is_business_verified: false,
    created_at: '2024-01-20T14:00:00Z'
  },
  {
    id: '4',
    first_name: 'سارة',
    last_name: 'علي',
    is_business_verified: true,
    created_at: '2024-01-05T12:00:00Z'
  }
];

// Mock Ads Data
let mockAds: MockAd[] = [
  {
    id: '1',
    user_id: '1',
    title: 'آيفون 14 برو ماكس للبيع',
    description: 'آيفون 14 برو ماكس 256 جيجا، لون ذهبي، حالة ممتازة جداً. استعمال خفيف لمدة 6 أشهر فقط. يأتي مع الشاحن والعلبة الأصلية وواقي الشاشة. البطارية 95%. لا يوجد خدوش أو كسور.',
    category_id: '3',
    price: 4200,
    currency: 'ILS',
    price_type: 'negotiable',
    city: 'رام الله',
    region: 'ramallah',
    status: 'active',
    ad_type: 'sell',
    condition_type: 'used',
    is_featured: true,
    is_urgent: false,
    contact_name: 'أحمد محمد',
    contact_phone: '0598765432',
    contact_email: 'ahmed.mohammad@example.com',
    contact_method: ['phone', 'email'],
    views_count: 87,
    favorites_count: 12,
    messages_count: 5,
    is_business_ad: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    category: mockCategories.find(c => c.id === '3'),
    user: mockUsers.find(u => u.id === '1'),
    is_favorited: false
  },
  {
    id: '2',
    user_id: '2',
    title: 'سيارة تويوتا كامري 2019 فل كامل',
    description: 'سيارة تويوتا كامري موديل 2019، فل كامل المواصفات. ماشية 45 ألف كيلو فقط. تأمين شامل ساري حتى نهاية العام. جير أوتوماتيك، فتحة سقف، كاميرا خلفية، شاشة تاتش. صيانة دورية في الوكالة.',
    category_id: '1',
    price: 18500,
    currency: 'USD',
    price_type: 'fixed',
    city: 'نابلس',
    region: 'nablus',
    status: 'active',
    ad_type: 'sell',
    condition_type: 'used',
    is_featured: false,
    is_urgent: true,
    contact_name: 'فاطمة أحمد',
    contact_phone: '0569876543',
    contact_method: ['phone'],
    views_count: 156,
    favorites_count: 23,
    messages_count: 8,
    is_business_ad: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: mockCategories.find(c => c.id === '1'),
    user: mockUsers.find(u => u.id === '2'),
    is_favorited: true
  },
  {
    id: '3',
    user_id: '3',
    title: 'شقة للإيجار في البيرة - 3 غرف',
    description: 'شقة مفروشة للإيجار في البيرة، الطابق الثالث. تتكون من 3 غرف نوم، صالة كبيرة، مطبخ مجهز بالكامل، حمامين. تدفئة مركزية، إنترنت، كيبل. موقع ممتاز قريب من الجامعات والمواصلات.',
    category_id: '2',
    price: 600,
    currency: 'USD',
    price_type: 'fixed',
    city: 'البيرة',
    region: 'ramallah',
    status: 'active',
    ad_type: 'rent',
    is_featured: true,
    is_urgent: true,
    contact_name: 'محمد خالد',
    contact_phone: '0597654321',
    contact_method: ['phone'],
    views_count: 98,
    favorites_count: 17,
    messages_count: 6,
    is_business_ad: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    category: mockCategories.find(c => c.id === '2'),
    user: mockUsers.find(u => u.id === '3'),
    is_favorited: false
  },
  {
    id: '4',
    user_id: '4',
    title: 'لابتوب HP Pavilion للبيع',
    description: 'لابتوب HP Pavilion، معالج Intel Core i7 الجيل العاشر، ذاكرة 16 جيجا رام، هارد SSD 512 جيجا. كارت شاشة منفصل NVIDIA GTX 1650. مناسب للألعاب والبرمجة. استعمال سنة واحدة.',
    category_id: '3',
    price: 2800,
    currency: 'ILS',
    price_type: 'negotiable',
    city: 'بيت لحم',
    region: 'bethlehem',
    status: 'active',
    ad_type: 'sell',
    condition_type: 'used',
    is_featured: false,
    is_urgent: false,
    contact_name: 'سارة علي',
    contact_phone: '0587654321',
    contact_method: ['phone'],
    views_count: 45,
    favorites_count: 8,
    messages_count: 3,
    is_business_ad: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
    category: mockCategories.find(c => c.id === '3'),
    user: mockUsers.find(u => u.id === '4'),
    is_favorited: false
  },
  {
    id: '5',
    user_id: '1',
    title: 'طقم صالون مودرن للبيع',
    description: 'طقم صالون مودرن مكون من كنبة 3 مقاعد + كنبتين مفردتين + طاولة وسط رخام. لون بيج فاتح، قماش عالي الجودة. حالة ممتازة، استعمال سنتين فقط. السبب في البيع: السفر.',
    category_id: '5',
    price: 1500,
    currency: 'USD',
    price_type: 'negotiable',
    city: 'الخليل',
    region: 'hebron',
    status: 'active',
    ad_type: 'sell',
    condition_type: 'used',
    is_featured: false,
    is_urgent: false,
    contact_name: 'أحمد محمد',
    contact_phone: '0598765432',
    contact_method: ['phone'],
    views_count: 67,
    favorites_count: 11,
    messages_count: 4,
    is_business_ad: false,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString(),
    category: mockCategories.find(c => c.id === '5'),
    user: mockUsers.find(u => u.id === '1'),
    is_favorited: false
  },
  {
    id: '6',
    user_id: '2',
    title: 'كتب جامعية - كلية الهندسة',
    description: 'مجموعة كتب جامعية لكلية الهندسة، تخصص مدني. تشمل: الرياضيات الهندسية، الفيزياء، الإنشاءات، المساحة. حالة جيدة جداً، مع الملاحظات والتلخيصات. مناسبة لطلاب السنوات الأولى.',
    category_id: '7',
    price: 200,
    currency: 'ILS',
    price_type: 'fixed',
    city: 'جنين',
    region: 'jenin',
    status: 'active',
    ad_type: 'sell',
    condition_type: 'used',
    is_featured: false,
    is_urgent: false,
    contact_name: 'فاطمة أحمد',
    contact_phone: '0569876543',
    contact_method: ['phone'],
    views_count: 23,
    favorites_count: 4,
    messages_count: 2,
    is_business_ad: false,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
    category: mockCategories.find(c => c.id === '7'),
    user: mockUsers.find(u => u.id === '2'),
    is_favorited: false
  }
];

class MockDataService {
  private static instance: MockDataService;
  
  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // Simulate API delay
  private async simulateDelay(ms: number = 300): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  // Categories
  async getCategories(): Promise<{ data: MockCategory[]; error: null }> {
    logger.debug('Fetching categories from mock data', null, 'MockDataService');
    await this.simulateDelay(200);
    
    return {
      data: [...mockCategories],
      error: null
    };
  }

  // Ads
  async getAds(filters: any = {}, page: number = 1, limit: number = 20): Promise<{
    data: MockAd[];
    total: number;
    hasMore: boolean;
    error: null;
  }> {
    logger.debug('Fetching ads from mock data', { filters, page, limit }, 'MockDataService');
    await this.simulateDelay();

    let filteredAds = [...mockAds];

    // Apply filters
    if (filters.category) {
      filteredAds = filteredAds.filter(ad => ad.category_id === filters.category);
    }
    
    if (filters.city) {
      filteredAds = filteredAds.filter(ad => 
        ad.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredAds = filteredAds.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm) ||
        ad.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.isFeatured) {
      filteredAds = filteredAds.filter(ad => ad.is_featured);
    }

    if (filters.isUrgent) {
      filteredAds = filteredAds.filter(ad => ad.is_urgent);
    }

    // Sort by created date (newest first)
    filteredAds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAds = filteredAds.slice(startIndex, endIndex);

    return {
      data: paginatedAds,
      total: filteredAds.length,
      hasMore: endIndex < filteredAds.length,
      error: null
    };
  }

  async getAdById(id: string): Promise<{ data: MockAd | null; error: string | null }> {
    logger.debug('Fetching ad by ID from mock data', { id }, 'MockDataService');
    await this.simulateDelay(150);

    const ad = mockAds.find(a => a.id === id);
    
    if (!ad) {
      return {
        data: null,
        error: 'الإعلان غير موجود'
      };
    }

    // Increment view count
    ad.views_count += 1;

    return {
      data: { ...ad },
      error: null
    };
  }

  async createAd(adData: Partial<MockAd>): Promise<{ data: MockAd | null; error: string | null }> {
    logger.info('Creating new ad in mock data', adData, 'MockDataService');
    await this.simulateDelay(500);

    try {
      const newAd: MockAd = {
        id: `mock_${Date.now()}`,
        user_id: 'current_user',
        title: adData.title || '',
        description: adData.description || '',
        category_id: adData.category_id || '1',
        price: adData.price,
        currency: adData.currency || 'ILS',
        price_type: adData.price_type || 'fixed',
        city: adData.city || '',
        region: adData.region || '',
        status: 'active',
        ad_type: adData.ad_type || 'sell',
        condition_type: adData.condition_type,
        is_featured: false,
        is_urgent: adData.is_urgent || false,
        contact_name: adData.contact_name || '',
        contact_phone: adData.contact_phone || '',
        contact_email: adData.contact_email,
        contact_method: adData.contact_method || ['phone'],
        views_count: 0,
        favorites_count: 0,
        messages_count: 0,
        is_business_ad: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: mockCategories.find(c => c.id === adData.category_id),
        user: {
          id: 'current_user',
          first_name: 'مستخدم',
          last_name: 'جديد',
          is_business_verified: false,
          created_at: new Date().toISOString()
        },
        is_favorited: false
      };

      // Add to mock data
      mockAds.unshift(newAd);

      logger.info('Ad created successfully', { id: newAd.id }, 'MockDataService');
      
      return {
        data: newAd,
        error: null
      };
    } catch (error) {
      logger.error('Failed to create ad', error, 'MockDataService');
      return {
        data: null,
        error: 'فشل في إنشاء الإعلان'
      };
    }
  }

  async toggleFavorite(adId: string): Promise<{ data: boolean; error: string | null }> {
    logger.debug('Toggling favorite status', { adId }, 'MockDataService');
    await this.simulateDelay(200);

    const ad = mockAds.find(a => a.id === adId);
    if (!ad) {
      return {
        data: false,
        error: 'الإعلان غير موجود'
      };
    }

    ad.is_favorited = !ad.is_favorited;
    ad.favorites_count += ad.is_favorited ? 1 : -1;

    return {
      data: ad.is_favorited,
      error: null
    };
  }

  // Get statistics
  async getStats(): Promise<{
    data: {
      totalAds: number;
      totalUsers: number;
      totalCategories: number;
    };
    error: null;
  }> {
    logger.debug('Fetching stats from mock data', null, 'MockDataService');
    await this.simulateDelay(100);

    return {
      data: {
        totalAds: mockAds.length,
        totalUsers: mockUsers.length,
        totalCategories: mockCategories.length
      },
      error: null
    };
  }
}

export const mockDataService = MockDataService.getInstance();
export default mockDataService;
