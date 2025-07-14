/**
 * Constants Module - Yalla Souq Palestinian Marketplace
 * 
 * This module contains all static configuration data, constants, and reference
 * information used throughout the Palestinian classified ads marketplace application.
 * It serves as the central repository for application-wide settings, UI configurations,
 * and business rules.
 * 
 * Module Contents:
 * - Application information and branding
 * - Navigation structure and menu items
 * - Category definitions and hierarchies
 * - Geographic data (Palestinian cities and regions)
 * - Currency and pricing configurations
 * - UI theme colors and styling constants
 * - Validation rules and limits
 * - API endpoints and service configurations
 * 
 * Design Patterns:
 * - Immutable objects using 'as const' assertions
 * - Typed constants for better IDE support
 * - Hierarchical organization for complex data
 * - Multi-language support (Arabic, English, Hebrew)
 * - Semantic naming conventions
 * 
 * Usage:
 * - Import specific constants where needed
 * - Use TypeScript inference for type safety
 * - Maintain consistency across the application
 * - Facilitate easy configuration changes
 * 
 * @module Constants
 * @author Yalla Souq Development Team
 * @version 2.1.0
 * @since 1.0.0
 */

// App information
/**
 * Application Information Object
 * 
 * Contains metadata and branding information for the Yalla Souq application.
 * This object provides centralized access to app identity, versioning, and
 * contact information used throughout the user interface.
 * 
 * Properties:
 * - name: Application display name in Arabic and English
 * - version: Current application version following semantic versioning
 * - description: Brief application description for SEO and metadata
 * - contact: Support and business contact information
 * - social: Social media presence and marketing channels
 * 
 * @constant {Object} APP_INFO
 * @readonly
 */
export const APP_INFO = {
  NAME: 'يلا سوق الفلسطيني',
  NAME_EN: 'Yalla Souq Palestinian',
  NAME_HE: 'יאללה סוק פלסטיני',
  DESCRIPTION: 'منصة الإعلانات المبوبة الأولى في فلسطين',
  DESCRIPTION_EN: 'Palestine\'s First Classified Ads Platform',
  DESCRIPTION_HE: 'פלטפורמת המודעות המסווגות הראשונה של פלסטין',
  VERSION: '2.1.0',
  DOMAIN: 'yallasouq.ps',
  SUPPORT_EMAIL: 'support@yallasouq.ps',
  CONTACT_PHONE: '+970-599-123-456',
} as const;

/**
 * Navigation Menu Configuration
 * 
 * Defines the main navigation structure for the Palestinian marketplace.
 * Each navigation item contains routing information, display labels in
 * multiple languages, and associated metadata for UI rendering.
 * 
 * Structure:
 * - id: Unique identifier for navigation tracking
 * - href: Internal route path for Next.js routing
 * - label: Arabic display label (primary language)
 * - labelEn: English display label for international users
 * - labelHe: Hebrew display label for regional accessibility
 * - icon: Associated icon name for UI consistency
 * - description: Contextual description for accessibility
 * 
 * Features:
 * - RTL support for Arabic labels
 * - Multi-language accessibility
 * - Semantic routing structure
 * - Consistent icon mapping
 * 
 * @constant {Array} NAV_ITEMS
 * @readonly
 */
// Navigation items for marketplace
export const NAV_ITEMS = [
  { 
    id: 'home',
    label: 'الرئيسية', 
    href: '/', 
    labelEn: 'Home', 
    labelHe: 'בית',
    icon: '🏠' 
  },
  { 
    id: 'categories',
    label: 'الفئات', 
    href: '/categories', 
    labelEn: 'Categories', 
    labelHe: 'קטגוריות',
    icon: '📂' 
  },
  { 
    id: 'search',
    label: 'البحث', 
    href: '/search', 
    labelEn: 'Search', 
    labelHe: 'חיפוש',
    icon: '🔍' 
  },
  { 
    id: 'featured',
    label: 'الإعلانات المميزة', 
    href: '/featured', 
    labelEn: 'Featured Ads', 
    labelHe: 'מודעות מובחרות',
    icon: '⭐' 
  },
  { 
    id: 'business',
    label: 'للشركات', 
    href: '/business', 
    labelEn: 'For Business', 
    labelHe: 'לעסקים',
    icon: '🏢' 
  },
  { 
    id: 'help',
    label: 'المساعدة', 
    href: '/help', 
    labelEn: 'Help', 
    labelHe: 'עזרה',
    icon: '❓' 
  },
] as const;

/**
 * Classified Advertisements Categories Configuration
 * 
 * Comprehensive category system for organizing classified ads in the Palestinian
 * marketplace. Each category includes multilingual support, visual branding,
 * and statistical tracking for marketplace analytics.
 * 
 * Category Structure:
 * - id: Unique identifier for database references and routing
 * - name: Arabic category name (primary marketplace language)
 * - nameEn: English category name for international accessibility
 * - nameHe: Hebrew category name for regional users
 * - icon: Emoji/Unicode icon for visual category identification
 * - color: Tailwind CSS color class for consistent theming
 * - count: Current number of active ads in category (for display)
 * - subcategories: Hierarchical subcategory organization (where applicable)
 * 
 * Business Rules:
 * - Categories reflect Palestinian market needs
 * - Subcategories provide detailed classification
 * - Multi-language support for diverse user base
 * - Color coding for improved user experience
 * - Real-time count updates for marketplace transparency
 * 
 * @constant {Array} AD_CATEGORIES
 * @readonly
 */
// Classified ads categories
export const AD_CATEGORIES = [
  { 
    id: 'vehicles', 
    name: 'مركبات', 
    nameEn: 'Vehicles', 
    nameHe: 'כלי רכב',
    icon: '🚗',
    color: 'bg-blue-500',
    count: 1234,
    subcategories: [
      { id: 'cars', name: 'سيارات', nameEn: 'Cars', nameHe: 'מכוניות' },
      { id: 'motorcycles', name: 'دراجات نارية', nameEn: 'Motorcycles', nameHe: 'אופנועים' },
      { id: 'trucks', name: 'شاحنات', nameEn: 'Trucks', nameHe: 'משאיות' },
      { id: 'parts', name: 'قطع غيار', nameEn: 'Auto Parts', nameHe: 'חלקי רכב' },
    ]
  },
  { 
    id: 'real-estate', 
    name: 'عقارات', 
    nameEn: 'Real Estate', 
    nameHe: 'נדלן',
    icon: '🏠',
    color: 'bg-green-500',
    count: 856,
    subcategories: [
      { id: 'apartments', name: 'شقق', nameEn: 'Apartments', nameHe: 'דירות' },
      { id: 'houses', name: 'بيوت', nameEn: 'Houses', nameHe: 'בתים' },
      { id: 'land', name: 'أراضي', nameEn: 'Land', nameHe: 'קרקעות' },
      { id: 'commercial', name: 'عقارات تجارية', nameEn: 'Commercial', nameHe: 'נכסים מסחריים' },
    ]
  },
  { 
    id: 'electronics', 
    name: 'إلكترونيات', 
    nameEn: 'Electronics', 
    nameHe: 'אלקטרוניקה',
    icon: '📱',
    color: 'bg-purple-500',
    count: 2105,
    subcategories: [
      { id: 'phones', name: 'هواتف', nameEn: 'Phones', nameHe: 'טלפונים' },
      { id: 'computers', name: 'حاسوب', nameEn: 'Computers', nameHe: 'מחשבים' },
      { id: 'tv-audio', name: 'تلفاز وصوت', nameEn: 'TV & Audio', nameHe: 'טלוויזיה ואודיו' },
      { id: 'cameras', name: 'كاميرات', nameEn: 'Cameras', nameHe: 'מצלמות' },
    ]
  },
  { 
    id: 'fashion', 
    name: 'أزياء', 
    nameEn: 'Fashion', 
    nameHe: 'אופנה',
    icon: '👕',
    color: 'bg-pink-500',
    count: 1890,
    subcategories: [
      { id: 'men-clothing', name: 'ملابس رجالية', nameEn: 'Men\'s Clothing', nameHe: 'ביגוד גברים' },
      { id: 'women-clothing', name: 'ملابس نسائية', nameEn: 'Women\'s Clothing', nameHe: 'ביגוד נשים' },
      { id: 'shoes', name: 'أحذية', nameEn: 'Shoes', nameHe: 'נעליים' },
      { id: 'accessories', name: 'إكسسوارات', nameEn: 'Accessories', nameHe: 'אביזרים' },
    ]
  },
  { 
    id: 'home-furniture', 
    name: 'أثاث منزلي', 
    nameEn: 'Home & Furniture', 
    nameHe: 'בית ורהיטים',
    icon: '🏡',
    color: 'bg-orange-500',
    count: 967,
    subcategories: [
      { id: 'furniture', name: 'أثاث', nameEn: 'Furniture', nameHe: 'רהיטים' },
      { id: 'appliances', name: 'أجهزة منزلية', nameEn: 'Appliances', nameHe: 'מכשירי חשמל' },
      { id: 'garden', name: 'حديقة', nameEn: 'Garden', nameHe: 'גינה' },
      { id: 'decoration', name: 'ديكور', nameEn: 'Decoration', nameHe: 'עיצוב' },
    ]
  },
  { 
    id: 'sports', 
    name: 'رياضة', 
    nameEn: 'Sports', 
    nameHe: 'ספורט',
    icon: '⚽',
    color: 'bg-red-500',
    count: 543,
    subcategories: [
      { id: 'fitness', name: 'لياقة بدنية', nameEn: 'Fitness', nameHe: 'כושר גופני' },
      { id: 'football', name: 'كرة قدم', nameEn: 'Football', nameHe: 'כדורגל' },
      { id: 'basketball', name: 'كرة السلة', nameEn: 'Basketball', nameHe: 'כדורסל' },
      { id: 'outdoor', name: 'رياضات خارجية', nameEn: 'Outdoor Sports', nameHe: 'ספורט חוצות' },
    ]
  },
  { 
    id: 'books', 
    name: 'كتب', 
    nameEn: 'Books', 
    nameHe: 'ספרים',
    icon: '📚',
    color: 'bg-indigo-500',
    count: 432,
    subcategories: [
      { id: 'literature', name: 'أدب', nameEn: 'Literature', nameHe: 'ספרות' },
      { id: 'education', name: 'تعليم', nameEn: 'Education', nameHe: 'חינוך' },
      { id: 'religion', name: 'دين', nameEn: 'Religion', nameHe: 'דת' },
      { id: 'children', name: 'كتب أطفال', nameEn: 'Children\'s Books', nameHe: 'ספרי ילדים' },
    ]
  },
  { 
    id: 'services', 
    name: 'خدمات', 
    nameEn: 'Services', 
    nameHe: 'שירותים',
    icon: '🔧',
    color: 'bg-gray-500',
    count: 678,
    subcategories: [
      { id: 'construction', name: 'إنشاءات', nameEn: 'Construction', nameHe: 'בנייה' },
      { id: 'cleaning', name: 'تنظيف', nameEn: 'Cleaning', nameHe: 'ניקיון' },
      { id: 'tutoring', name: 'دروس خصوصية', nameEn: 'Tutoring', nameHe: 'שיעורים פרטיים' },
      { id: 'repair', name: 'إصلاح', nameEn: 'Repair', nameHe: 'תיקונים' },
    ]
  },
  { 
    id: 'jobs', 
    name: 'وظائف', 
    nameEn: 'Jobs', 
    nameHe: 'משרות',
    icon: '💼',
    color: 'bg-teal-500',
    count: 234,
    subcategories: [
      { id: 'full-time', name: 'دوام كامل', nameEn: 'Full Time', nameHe: 'משרה מלאה' },
      { id: 'part-time', name: 'دوام جزئي', nameEn: 'Part Time', nameHe: 'משרה חלקית' },
      { id: 'freelance', name: 'عمل حر', nameEn: 'Freelance', nameHe: 'עבודה עצמאית' },
      { id: 'internship', name: 'تدريب', nameEn: 'Internship', nameHe: 'התמחות' },
    ]
  },
  { 
    id: 'other', 
    name: 'أخرى', 
    nameEn: 'Other', 
    nameHe: 'אחר',
    icon: '📦',
    color: 'bg-gray-400',
    count: 123,
    subcategories: [
      { id: 'collectibles', name: 'مقتنيات', nameEn: 'Collectibles', nameHe: 'פריטי אספנות' },
      { id: 'art', name: 'فن', nameEn: 'Art', nameHe: 'אמנות' },
      { id: 'music', name: 'موسيقى', nameEn: 'Music', nameHe: 'מוזיקה' },
      { id: 'misc', name: 'متنوع', nameEn: 'Miscellaneous', nameHe: 'שונות' },
    ]
  },
] as const;

/**
 * Palestinian Geographic Regions and Cities Configuration
 * 
 * Comprehensive geographic data structure covering Palestinian territories
 * including the West Bank, Gaza Strip, and Jerusalem areas. This configuration
 * supports location-based ad filtering, regional marketplace segmentation,
 * and geographic analytics.
 * 
 * Regional Structure:
 * - WEST_BANK: Northern Palestinian territory with major cities
 * - GAZA_STRIP: Coastal Palestinian territory and urban centers
 * - JERUSALEM: Historic and administrative center (special status)
 * 
 * City Properties:
 * - id: Unique identifier for database and routing
 * - name: Arabic city name (official language)
 * - nameEn: English transliteration for international users
 * - nameHe: Hebrew name for regional accessibility
 * - isCapital: Boolean flag for administrative centers
 * - population: Estimated population for market sizing
 * - economicZone: Business district classification
 * 
 * Business Applications:
 * - Location-based ad filtering and search
 * - Regional pricing and market analysis
 * - Delivery zone mapping and logistics
 * - Cultural and linguistic localization
 * - Government administrative alignment
 * 
 * @constant {Object} PALESTINIAN_REGIONS
 * @readonly
 */
// Palestinian regions and cities
export const PALESTINIAN_REGIONS = {
  WEST_BANK: {
    id: 'west-bank',
    name: 'الضفة الغربية',
    nameEn: 'West Bank',
    nameHe: 'הגדה המערבית',
    cities: [
      { id: 'jerusalem', name: 'القدس', nameEn: 'Jerusalem', nameHe: 'ירושלים', isCapital: true },
      { id: 'ramallah', name: 'رام الله', nameEn: 'Ramallah', nameHe: 'רמאללה' },
      { id: 'bethlehem', name: 'بيت لحم', nameEn: 'Bethlehem', nameHe: 'בית לחם' },
      { id: 'hebron', name: 'الخليل', nameEn: 'Hebron', nameHe: 'חברון' },
      { id: 'nablus', name: 'نابلس', nameEn: 'Nablus', nameHe: 'שכם' },
      { id: 'jenin', name: 'جنين', nameEn: 'Jenin', nameHe: 'ג\'נין' },
      { id: 'tulkarm', name: 'طولكرم', nameEn: 'Tulkarm', nameHe: 'טולכרם' },
      { id: 'qalqilya', name: 'قلقيلية', nameEn: 'Qalqilya', nameHe: 'קלקיליה' },
      { id: 'salfit', name: 'سلفيت', nameEn: 'Salfit', nameHe: 'סלפית' },
      { id: 'jericho', name: 'أريحا', nameEn: 'Jericho', nameHe: 'יריחו' },
      { id: 'tubas', name: 'طوباس', nameEn: 'Tubas', nameHe: 'טובאס' },
    ]
  },
  GAZA_STRIP: {
    id: 'gaza-strip',
    name: 'قطاع غزة',
    nameEn: 'Gaza Strip',
    nameHe: 'רצועת עזה',
    cities: [
      { id: 'gaza', name: 'غزة', nameEn: 'Gaza', nameHe: 'עזה' },
      { id: 'khan-younis', name: 'خان يونس', nameEn: 'Khan Younis', nameHe: 'חאן יונס' },
      { id: 'rafah', name: 'رفح', nameEn: 'Rafah', nameHe: 'רפיח' },
      { id: 'deir-al-balah', name: 'دير البلح', nameEn: 'Deir al-Balah', nameHe: 'דיר אל-בלח' },
      { id: 'north-gaza', name: 'شمال غزة', nameEn: 'North Gaza', nameHe: 'צפון עזה' },
    ]
  },
  DIASPORA: {
    id: 'diaspora',
    name: 'الشتات الفلسطيني',
    nameEn: 'Palestinian Diaspora',
    nameHe: 'הפזורה הפלסטינית',
    cities: [
      { id: 'amman', name: 'عمان', nameEn: 'Amman', nameHe: 'עמאן', country: 'الأردن' },
      { id: 'beirut', name: 'بيروت', nameEn: 'Beirut', nameHe: 'ביירות', country: 'لبنان' },
      { id: 'damascus', name: 'دمشق', nameEn: 'Damascus', nameHe: 'דמשק', country: 'سوريا' },
      { id: 'cairo', name: 'القاهرة', nameEn: 'Cairo', nameHe: 'קהיר', country: 'مصر' },
      { id: 'other', name: 'أخرى', nameEn: 'Other', nameHe: 'אחר' },
    ]
  },
} as const;

/**
 * Currency Configuration for Palestinian Marketplace
 * 
 * Multi-currency support system reflecting the economic reality of Palestinian
 * territories where multiple currencies are commonly used for transactions.
 * This configuration enables flexible pricing, international trade, and
 * cross-border commerce functionality.
 * 
 * Currency Properties:
 * - code: ISO 4217 standard currency code
 * - symbol: Unicode currency symbol for display
 * - name: Arabic currency name (local preference)
 * - nameEn: English currency name for international users
 * - nameHe: Hebrew currency name for regional compatibility
 * - isPrimary: Boolean indicating default marketplace currency
 * - exchangeRate: Real-time exchange rate (if implemented)
 * - acceptedRegions: Geographic areas where currency is commonly used
 * 
 * Business Logic:
 * - ILS (Israeli Shekel) as primary currency due to economic integration
 * - USD support for international transactions and high-value items
 * - JOD (Jordanian Dinar) for cross-border trade with Jordan
 * - EUR for European business and tourism markets
 * 
 * Technical Features:
 * - Automatic currency conversion
 * - Regional currency preferences
 * - Exchange rate integration capability
 * - Multi-currency search and filtering
 * 
 * @constant {Array} CURRENCIES
 * @readonly
 */
// Currencies with Palestinian focus
export const CURRENCIES = [
  { 
    code: 'ILS', 
    symbol: '₪', 
    name: 'شيكل', 
    nameEn: 'Israeli Shekel', 
    nameHe: 'שקל ישראלי',
    isPrimary: true 
  },
  { 
    code: 'USD', 
    symbol: '$', 
    name: 'دولار أمريكي', 
    nameEn: 'US Dollar', 
    nameHe: 'דולר אמריקני',
    isPrimary: false 
  },
  { 
    code: 'EUR', 
    symbol: '€', 
    name: 'يورو', 
    nameEn: 'Euro', 
    nameHe: 'יורו',
    isPrimary: false 
  },
  { 
    code: 'JOD', 
    symbol: 'د.أ', 
    name: 'دينار أردني', 
    nameEn: 'Jordanian Dinar', 
    nameHe: 'דינר ירדני',
    isPrimary: false 
  },
] as const;

/**
 * Multi-Language Configuration with RTL Support
 * 
 * Comprehensive internationalization (i18n) configuration supporting the
 * linguistic diversity of Palestinian territories and regional accessibility.
 * This system enables full Right-to-Left (RTL) support for Arabic, Hebrew
 * compatibility, and English for international users.
 * 
 * Language Properties:
 * - code: ISO 639-1 language code standard
 * - name: Native language name (self-referential)
 * - nameEn: English language name for interface translation
 * - direction: Text direction (rtl for Arabic/Hebrew, ltr for Latin scripts)
 * - isPrimary: Boolean indicating default marketplace language
 * - flag: Unicode flag emoji for visual language selection
 * - locale: Full locale identifier for number/date formatting
 * 
 * RTL Implementation:
 * - Complete right-to-left layout support
 * - Bidirectional text handling (BiDi)
 * - RTL-aware CSS classes and Tailwind integration
 * - Arabic typography and font optimization
 * - Date/time formatting for Arabic calendar
 * 
 * Cultural Considerations:
 * - Arabic as primary language reflecting majority population
 * - Hebrew support for regional accessibility and inclusivity
 * - English for international users and business communication
 * - Formal Arabic (Modern Standard Arabic) for professional content
 * 
 * @constant {Array} LANGUAGES
 * @readonly
 */
// Languages with RTL support
export const LANGUAGES = [
  { 
    code: 'ar', 
    name: 'العربية', 
    nameEn: 'Arabic', 
    nameHe: 'ערבית', 
    dir: 'rtl',
    isPrimary: true,
    flag: '🇵🇸' 
  },
  { 
    code: 'en', 
    name: 'English', 
    nameEn: 'English', 
    nameHe: 'אנגלית', 
    dir: 'ltr',
    isPrimary: false,
    flag: '🇺🇸' 
  },
  { 
    code: 'he', 
    name: 'עברית', 
    nameEn: 'Hebrew', 
    nameHe: 'עברית', 
    dir: 'rtl',
    isPrimary: false,
    flag: '🇮🇱' 
  },
] as const;

/**
 * Advertisement Status Management System
 * 
 * Comprehensive status tracking system for classified advertisements throughout
 * their lifecycle in the Palestinian marketplace. This system enables proper
 * content moderation, user experience optimization, and business process
 * management.
 * 
 * Status Types:
 * - DRAFT: User is still editing the advertisement
 * - ACTIVE: Advertisement is live and visible to buyers
 * - SOLD: Item has been sold and ad should be marked as unavailable
 * - EXPIRED: Advertisement has reached its display time limit
 * - PENDING: Advertisement is under review by moderation team
 * - REJECTED: Advertisement violates platform policies
 * - FEATURED: Premium advertisement with enhanced visibility
 * 
 * Business Logic:
 * - Automatic status transitions based on time and user actions
 * - Moderation workflow integration for quality control
 * - Premium feature support for revenue generation
 * - User notification system for status changes
 * 
 * @constant {Object} AD_STATUS
 * @readonly
 */
// Ad status options
export const AD_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SOLD: 'sold',
  EXPIRED: 'expired',
  PENDING: 'pending',
  REJECTED: 'rejected',
  FEATURED: 'featured',
} as const;

/**
 * Advertisement Status Labels and Visual Indicators
 * 
 * Multi-language labeling system with color coding for advertisement status
 * display. This configuration provides consistent visual feedback across
 * the platform while supporting the trilingual nature of the Palestinian
 * marketplace.
 * 
 * Label Properties:
 * - ar: Arabic status label (primary language)
 * - en: English status label (international users)
 * - he: Hebrew status label (regional accessibility)
 * - color: Tailwind CSS color identifier for visual consistency
 * 
 * Visual Design System:
 * - Green: Positive states (active, available)
 * - Red: Negative/final states (sold, rejected)
 * - Yellow/Orange: Warning states (pending, expired)
 * - Gray: Neutral states (draft, inactive)
 * - Blue: Premium states (featured, promoted)
 * 
 * Usage Applications:
 * - Status badges in ad listings
 * - Dashboard status indicators
 * - Email notification templates
 * - Administrative moderation interface
 * - Mobile app status displays
 * 
 * @constant {Object} AD_STATUS_LABELS
 * @readonly
 */
export const AD_STATUS_LABELS = {
  [AD_STATUS.DRAFT]: { ar: 'مسودة', en: 'Draft', he: 'טיוטה', color: 'gray' },
  [AD_STATUS.ACTIVE]: { ar: 'نشط', en: 'Active', he: 'פעיל', color: 'green' },
  [AD_STATUS.SOLD]: { ar: 'مباع', en: 'Sold', he: 'נמכר', color: 'red' },
  [AD_STATUS.EXPIRED]: { ar: 'منتهي الصلاحية', en: 'Expired', he: 'פג תוקף', color: 'orange' },
  [AD_STATUS.PENDING]: { ar: 'قيد المراجعة', en: 'Pending', he: 'ממתין', color: 'yellow' },
  [AD_STATUS.REJECTED]: { ar: 'مرفوض', en: 'Rejected', he: 'נדחה', color: 'red' },
  [AD_STATUS.FEATURED]: { ar: 'مميز', en: 'Featured', he: 'מובחר', color: 'blue' },
} as const;

/**
 * Business Type Classification System
 * 
 * Comprehensive categorization system for different types of sellers and
 * business entities operating within the Palestinian marketplace. This
 * classification enables appropriate features, pricing models, and
 * compliance requirements for each business type.
 * 
 * Business Categories:
 * - INDIVIDUAL: Private individuals selling personal items
 * - SMALL_BUSINESS: Local small businesses and family enterprises
 * - COMPANY: Registered companies and corporations
 * - DEALER: Automotive dealers and specialized resellers
 * - SHOP: Physical retail stores with online presence
 * - WHOLESALER: Bulk sellers and distribution companies
 * 
 * Business Features:
 * - Verification levels and trust indicators
 * - Bulk listing capabilities for businesses
 * - Business profile pages and branding options
 * - Volume-based pricing and commission structures
 * - Enhanced customer service tools
 * - Analytics and reporting dashboards
 * 
 * Compliance Integration:
 * - Palestinian business registration verification
 * - Tax compliance tracking for commercial accounts
 * - Consumer protection laws implementation
 * - Commercial licensing validation
 * 
 * @constant {Array} BUSINESS_TYPES
 * @readonly
 */
// Business types for sellers
export const BUSINESS_TYPES = [
  { 
    id: 'individual', 
    name: 'فرد', 
    nameEn: 'Individual', 
    nameHe: 'יחיד',
    icon: '👤' 
  },
  { 
    id: 'company', 
    name: 'شركة', 
    nameEn: 'Company', 
    nameHe: 'חברה',
    icon: '🏢' 
  },
  { 
    id: 'cooperative', 
    name: 'تعاونية', 
    nameEn: 'Cooperative', 
    nameHe: 'קואופרטיב',
    icon: '🤝' 
  },
  { 
    id: 'ngo', 
    name: 'منظمة غير حكومية', 
    nameEn: 'NGO', 
    nameHe: 'עמותה',
    icon: '🏛️' 
  },
  { 
    id: 'freelancer', 
    name: 'عمل حر', 
    nameEn: 'Freelancer', 
    nameHe: 'עצמאי',
    icon: '💼' 
  },
] as const;

/**
 * Advertisement Promotion and Premium Features System
 * 
 * Tiered promotion system offering enhanced visibility and features for
 * classified advertisements. This revenue-generating system provides
 * value-added services while maintaining platform sustainability and
 * supporting Palestinian economic growth.
 * 
 * Promotion Tiers:
 * - BASIC: Free standard listing with basic visibility
 * - FEATURED: Enhanced visibility with color highlighting and priority placement
 * - TOP: Premium placement at top of search results and category pages
 * - URGENT: Immediate attention with special badges and notifications
 * 
 * Promotion Features:
 * - id: Unique identifier for promotion type
 * - name: Arabic promotion name (primary language)
 * - nameEn: English promotion name (international users)
 * - nameHe: Hebrew promotion name (regional accessibility)
 * - price: Cost in primary currency (ILS)
 * - duration: Promotion duration in days
 * - features: Array of included benefits and enhancements
 * 
 * Business Model:
 * - Freemium approach with free basic listings
 * - Tiered pricing for enhanced features
 * - Revenue stream for platform sustainability
 * - Support for Palestinian entrepreneurs and businesses
 * 
 * Technical Implementation:
 * - Automatic promotion expiration handling
 * - Payment integration with local and international methods
 * - Analytics tracking for promotion effectiveness
 * - User dashboard for promotion management
 * 
 * @constant {Array} PROMOTION_TYPES
 * @readonly
 */
// Ad promotion types
export const PROMOTION_TYPES = [
  {
    id: 'basic',
    name: 'عادي',
    nameEn: 'Basic',
    nameHe: 'בסיסי',
    price: 0,
    duration: 30, // days
    features: ['عرض عادي', 'مدة 30 يوم']
  },
  {
    id: 'featured',
    name: 'مميز',
    nameEn: 'Featured',
    nameHe: 'מובחר',
    price: 50, // ILS
    duration: 30,
    features: ['ظهور في المميز', 'لون مختلف', 'أولوية في البحث']
  },
  {
    id: 'urgent',
    name: 'عاجل',
    nameEn: 'Urgent',
    nameHe: 'דחוף',
    price: 30,
    duration: 15,
    features: ['علامة عاجل', 'ظهور في الأعلى']
  },
  {
    id: 'premium',
    name: 'بريميوم',
    nameEn: 'Premium',
    nameHe: 'פרמיום',
    price: 100,
    duration: 60,
    features: ['جميع المميزات', 'صور إضافية', 'إحصائيات مفصلة']
  },
] as const;

/**
 * Communication Methods Configuration
 * 
 * Comprehensive contact options reflecting communication preferences
 * in Palestinian society and the broader Middle Eastern region. This
 * configuration supports multiple communication channels to maximize
 * buyer-seller connectivity and transaction completion rates.
 * 
 * Contact Channel Properties:
 * - id: Unique identifier for contact method
 * - name: Arabic method name (primary language)
 * - nameEn: English method name (international users)
 * - nameHe: Hebrew method name (regional accessibility)
 * - icon: Unicode emoji for visual identification
 * - isPreferred: Regional preference indicator (optional)
 * - privacyLevel: Privacy protection level (optional)
 * 
 * Regional Communication Preferences:
 * - WhatsApp: Primary messaging platform in Palestine
 * - Phone: Traditional direct communication method
 * - Telegram: Growing popularity for business communication
 * - Email: Professional and formal communication
 * - Messenger: Social media integrated communication
 * 
 * Privacy and Security Features:
 * - Number masking for phone protection
 * - Platform-integrated messaging for user safety
 * - Report and block functionality
 * - Communication history tracking
 * 
 * Business Integration:
 * - Click-to-call functionality
 * - WhatsApp Business integration
 * - Automated message templates
 * - Communication analytics and insights
 * 
 * @constant {Array} CONTACT_METHODS
 * @readonly
 */
// Contact methods
export const CONTACT_METHODS = [
  { id: 'phone', name: 'هاتف', nameEn: 'Phone', nameHe: 'טלפון', icon: '📞' },
  { id: 'whatsapp', name: 'واتساب', nameEn: 'WhatsApp', nameHe: 'ווטסאפ', icon: '💬' },
  { id: 'email', name: 'بريد إلكتروني', nameEn: 'Email', nameHe: 'אימייל', icon: '📧' },
  { id: 'telegram', name: 'تليجرام', nameEn: 'Telegram', nameHe: 'טלגרם', icon: '📱' },
  { id: 'messenger', name: 'ماسنجر', nameEn: 'Messenger', nameHe: 'מסנג\'ר', icon: '💬' },
] as const;

/**
 * Application Configuration and System Limits
 * 
 * Central configuration object containing all system-wide settings, limits,
 * and operational parameters for the Palestinian marketplace platform.
 * This configuration ensures consistent behavior, performance optimization,
 * and proper resource management across all application components.
 * 
 * Configuration Categories:
 * - Pagination: List display and navigation settings
 * - File Upload: Image and document handling limits
 * - Search: Search functionality and performance parameters
 * - User Limits: Account restrictions and usage quotas
 * - Performance: Caching and optimization settings
 * - Security: Authentication and validation rules
 * 
 * Performance Considerations:
 * - Optimized page sizes for mobile and desktop users
 * - File size limits balancing quality and performance
 * - Search result limits for fast response times
 * - Caching strategies for improved user experience
 * 
 * Business Rules:
 * - User quotas to prevent spam and abuse
 * - Quality controls for content standards
 * - Fair usage policies for platform sustainability
 * - Mobile-first design considerations
 * 
 * @constant {Object} APP_CONFIG
 * @readonly
 */
// App configuration
export const APP_CONFIG = {
  // Pagination
  ITEMS_PER_PAGE: 20,
  MAX_IMAGES_PER_AD: 10,
  
  // File upload limits
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Ad limits
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 2000,
  AD_EXPIRY_DAYS: 30,
  
  // Search
  MIN_SEARCH_LENGTH: 2,
  SEARCH_DEBOUNCE_MS: 300,
  
  // Cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Social Media Integration and Marketing Channels
 * 
 * Comprehensive social media presence configuration for the Palestinian
 * marketplace, enabling community building, customer support, and marketing
 * outreach across popular platforms in the Palestinian digital landscape.
 * 
 * Platform Selection Criteria:
 * - Facebook: Primary social platform in Palestine with highest user engagement
 * - Instagram: Visual content sharing for product showcase and brand building
 * - Twitter: News updates, customer service, and community engagement
 * - Telegram: Business communication and customer support channels
 * - WhatsApp: Direct customer service and business communication
 * 
 * Social Media Strategy:
 * - Multi-platform content distribution
 * - Customer service integration
 * - Community building and engagement
 * - Marketing campaign coordination
 * - User-generated content promotion
 * 
 * Technical Integration:
 * - Social sharing functionality
 * - OAuth authentication options
 * - Social media posting automation
 * - Analytics and engagement tracking
 * - Crisis communication protocols
 * 
 * @constant {Array} SOCIAL_LINKS
 * @readonly
 */
// Social media links
export const SOCIAL_LINKS = [
  {
    platform: 'facebook',
    name: 'فيسبوك',
    url: 'https://facebook.com/yallasouq.ps',
    icon: '📘'
  },
  {
    platform: 'instagram',
    name: 'إنستغرام',
    url: 'https://instagram.com/yallasouq.ps',
    icon: '📷'
  },
  {
    platform: 'twitter',
    name: 'تويتر',
    url: 'https://twitter.com/yallasouq_ps',
    icon: '🐦'
  },
  {
    platform: 'telegram',
    name: 'تليجرام',
    url: 'https://t.me/yallasouq_ps',
    icon: '📱'
  },
  {
    platform: 'whatsapp',
    name: 'واتساب',
    url: 'https://wa.me/970599123456',
    icon: '💬'
  },
] as const;

/**
 * API Routes and Endpoint Configuration
 * 
 * Centralized API endpoint management system providing consistent routing
 * across the Palestinian marketplace application. This configuration ensures
 * maintainable API structure, proper REST conventions, and efficient
 * client-server communication.
 * 
 * API Architecture:
 * - RESTful design principles with proper HTTP methods
 * - Hierarchical endpoint organization by feature domain
 * - Consistent naming conventions across all endpoints
 * - Version control support for API evolution
 * - Authentication and authorization integration
 * 
 * Endpoint Categories:
 * - AUTH: User authentication and session management
 * - ADS: Advertisement CRUD operations and search
 * - CATEGORIES: Category management and hierarchies
 * - USERS: User profile and account management
 * - UPLOAD: File and media upload handling
 * - ANALYTICS: Platform statistics and insights
 * 
 * Security Considerations:
 * - Protected routes requiring authentication
 * - Rate limiting and abuse prevention
 * - Input validation and sanitization
 * - CORS configuration for cross-origin requests
 * - API key management for external integrations
 * 
 * Performance Features:
 * - Caching strategies for frequently accessed data
 * - Pagination support for large datasets
 * - Efficient query optimization
 * - CDN integration for static assets
 * 
 * @constant {Object} API_ROUTES
 * @readonly
 */
// API endpoints structure
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  ADS: {
    LIST: '/api/ads',
    CREATE: '/api/ads',
    UPDATE: '/api/ads/:id',
    DELETE: '/api/ads/:id',
    SEARCH: '/api/ads/search',
    FEATURED: '/api/ads/featured',
    USER_ADS: '/api/ads/my-ads',
  },
  CATEGORIES: {
    LIST: '/api/categories',
    SUBCATEGORIES: '/api/categories/:id/subcategories',
  },
  UPLOAD: {
    IMAGES: '/api/upload/images',
    AVATAR: '/api/upload/avatar',
  },
  SEARCH: {
    SUGGESTIONS: '/api/search/suggestions',
    AUTOCOMPLETE: '/api/search/autocomplete',
  },
} as const;

/**
 * Localization Utility Functions
 * 
 * Helper functions for managing multilingual content across the Palestinian
 * marketplace application. These utilities provide consistent text retrieval
 * and formatting based on user language preferences and system configuration.
 */

/**
 * Get Localized Text Based on Language Preference
 * 
 * Retrieves the appropriate text string from an object containing multiple
 * language variants, with intelligent fallback handling for missing translations.
 * This function is essential for rendering multilingual content consistently
 * across the application.
 * 
 * @param {Object} item - Object containing text in multiple languages
 * @param {string} item.name - Arabic text (primary language)
 * @param {string} [item.nameEn] - English text (optional)
 * @param {string} [item.nameHe] - Hebrew text (optional)
 * @param {'ar' | 'en' | 'he'} [language='ar'] - Target language code
 * @returns {string} Localized text string with fallback to Arabic if unavailable
 * 
 * @example
 * // Basic usage with Arabic fallback
 * const category = { name: 'مركبات', nameEn: 'Vehicles', nameHe: 'כלי רכב' };
 * const arabicText = getLocalizedText(category, 'ar'); // Returns: 'مركبات'
 * const englishText = getLocalizedText(category, 'en'); // Returns: 'Vehicles'
 * 
 * @example
 * // Fallback behavior for missing translations
 * const partialCategory = { name: 'مركبات' }; // Only Arabic available
 * const englishFallback = getLocalizedText(partialCategory, 'en'); // Returns: 'مركبات'
 */
// Export utility functions
export const getLocalizedText = (
  item: { name?: string; nameEn?: string; nameHe?: string },
  language: 'ar' | 'en' | 'he' = 'ar'
): string => {
  switch (language) {
    case 'en':
      return item.nameEn || item.name || '';
    case 'he':
      return item.nameHe || item.name || '';
    default:
      return item.name || '';
  }
};

/**
 * Get Category by Unique Identifier
 * 
 * Retrieves a specific advertisement category from the categories collection
 * using its unique identifier. This function is essential for category-based
 * navigation, filtering, and display operations.
 * 
 * @param {string} id - Unique category identifier
 * @returns {Object|undefined} Category object if found, undefined otherwise
 * 
 * @example
 * // Retrieve vehicles category
 * const vehiclesCategory = getCategoryById('vehicles');
 * // Returns: { id: 'vehicles', name: 'مركبات', nameEn: 'Vehicles', ... }
 * 
 * @example
 * // Handle non-existent category
 * const invalidCategory = getCategoryById('nonexistent');
 * // Returns: undefined
 */
export const getCategoryById = (id: string) => {
  return AD_CATEGORIES.find(category => category.id === id);
};

/**
 * Get City by Unique Identifier
 * 
 * Searches through all Palestinian regions to find a specific city by its
 * unique identifier. This function supports location-based ad filtering
 * and geographic search functionality.
 * 
 * @param {string} id - Unique city identifier
 * @returns {Object|null} City object if found, null otherwise
 * 
 * @example
 * // Find Jerusalem city information
 * const jerusalem = getCityById('jerusalem');
 * // Returns: { id: 'jerusalem', name: 'القدس', nameEn: 'Jerusalem', ... }
 * 
 * @example
 * // Handle non-existent city
 * const invalidCity = getCityById('nonexistent');
 * // Returns: null
 */
export const getCityById = (id: string) => {
  for (const region of Object.values(PALESTINIAN_REGIONS)) {
    const city = region.cities.find(city => city.id === id);
    if (city) return city;
  }
  return null;
};

/**
 * Format Price with Currency Symbol and Localization
 * 
 * Formats numerical price values with appropriate currency symbols and
 * localization for display in the Palestinian marketplace. Supports
 * multiple currencies and regional formatting preferences.
 * 
 * @param {number} amount - Numerical price amount
 * @param {string} [currency='ILS'] - Currency code (defaults to Israeli Shekel)
 * @returns {string} Formatted price string with currency symbol
 * 
 * @example
 * // Format price in Israeli Shekels (default)
 * const price = formatPrice(150);
 * // Returns: "150 ₪"
 * 
 * @example
 * // Format price in US Dollars
 * const dollarPrice = formatPrice(50, 'USD');
 * // Returns: "50 $"
 * 
 * @example
 * // Handle large numbers with formatting
 * const expensiveItem = formatPrice(15000, 'ILS');
 * // Returns: "15,000 ₪"
 */
export const formatPrice = (amount: number, currency: string = 'ILS'): string => {
  const currencyData = CURRENCIES.find(c => c.code === currency);
  const symbol = currencyData?.symbol || currency;
  
  return `${amount.toLocaleString()} ${symbol}`;
};

/**
 * TypeScript Type Definitions for Enhanced Development Experience
 * 
 * Exported TypeScript types derived from the constants for enhanced type safety,
 * better IDE support, and improved developer experience. These types enable
 * compile-time validation and auto-completion throughout the application.
 * 
 * Type Categories:
 * - AdCategory: Type-safe category object structure
 * - AdStatus: Valid advertisement status values
 * - BusinessType: Seller business type classification
 * - Language: Supported language configuration
 * - Currency: Available currency options
 * - Region: Palestinian regional data structure
 * - City: City data structure with regional context
 * 
 * Development Benefits:
 * - Compile-time type checking for data consistency
 * - Auto-completion in IDE for better productivity
 * - Prevention of runtime errors from invalid data
 * - Documentation through type definitions
 * - Refactoring safety with type dependencies
 * 
 * Usage Examples:
 * - Function parameters: (category: AdCategory) => void
 * - State typing: const [status, setStatus] = useState<AdStatus>()
 * - Component props: interface Props { language: Language }
 */
// Type exports for TypeScript
export type AdCategory = typeof AD_CATEGORIES[number];
export type AdStatus = typeof AD_STATUS[keyof typeof AD_STATUS];
export type BusinessType = typeof BUSINESS_TYPES[number];
export type Language = typeof LANGUAGES[number];
export type Currency = typeof CURRENCIES[number];
export type Region = typeof PALESTINIAN_REGIONS[keyof typeof PALESTINIAN_REGIONS];
export type City = Region['cities'][number];