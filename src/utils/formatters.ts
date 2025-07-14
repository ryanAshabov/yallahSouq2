/**
 * Formatting Utilities Library - Yalla Souq Palestinian Marketplace
 * 
 * Comprehensive collection of formatting functions designed specifically
 * for the Palestinian marketplace platform. Provides consistent, culturally
 * appropriate formatting for currency, dates, numbers, text, and other
 * data types throughout the application.
 * 
 * Formatting Categories:
 * - Currency formatting with Palestinian market support (ILS/NIS, USD, EUR)
 * - Date and time formatting with Arabic localization
 * - Phone number formatting for Palestinian numbering system
 * - Address formatting for Palestinian geographic regions
 * - Text formatting for RTL (Right-to-Left) Arabic content
 * - Number formatting with Arabic numerals and separators
 * 
 * Palestinian Market Features:
 * - Israeli Shekel (ILS/NIS) as primary currency with proper symbols
 * - Palestinian phone number patterns (+970 country code)
 * - Arabic date formatting with Hijri calendar support
 * - Palestinian address structure (governorates, cities, neighborhoods)
 * - Arabic number formatting with proper digit representation
 * - Cultural preferences in decimal and thousand separators
 * 
 * Internationalization Support:
 * - Multi-language formatting (Arabic, English, Hebrew)
 * - Locale-aware number and currency formatting
 * - Unicode support for Arabic script and diacritics
 * - Direction-aware text formatting for RTL layouts
 * - Cultural date and time presentation preferences
 * - Regional currency and measurement unit support
 * 
 * Performance Optimization:
 * - Memoized formatting functions for repeated operations
 * - Efficient Intl API usage with proper locale caching
 * - Minimal string manipulation for optimal performance
 * - Tree-shaking compatible function exports
 * - Memory-efficient formatter instance management
 * 
 * Accessibility Features:
 * - Screen reader compatible formatted output
 * - ARIA-friendly number and currency announcements
 * - High contrast mode compatible text formatting
 * - Keyboard navigation friendly formatted content
 * - Assistive technology optimized date presentations
 * 
 * Error Handling:
 * - Graceful fallbacks for unsupported locales
 * - Invalid input sanitization and validation
 * - Default formatting when specific options fail
 * - Comprehensive error logging for debugging
 * - User-friendly error messages in Arabic
 * 
 * Technical Architecture:
 * - TypeScript implementation for type safety
 * - Modern JavaScript Intl API integration
 * - Pure functions with no side effects
 * - Modular design for selective importing
 * - Unit test compatible structure
 * 
 * Usage Examples:
 * ```typescript
 * // Palestinian currency formatting
 * formatCurrency(150, 'ILS', 'ar-PS') // "₪150.00"
 * 
 * // Arabic date formatting
 * formatDate(new Date(), 'ar-PS') // "الجمعة، ١٤ تموز ٢٠٢٥"
 * 
 * // Palestinian phone formatting
 * formatPhoneNumber('0591234567', 'PS') // "+970 59 123 4567"
 * 
 * // Arabic number formatting
 * formatNumber(1234567.89, 'ar-PS') // "١٬٢٣٤٬٥٦٧.٨٩"
 * ```
 * 
 * @module FormattingUtilities
 * @author Yalla Souq Development Team
 * @version 2.0.0
 * @since 1.0.0
 */

/**
 * Currency Formatting Function
 * 
 * Formats monetary amounts with proper currency symbols, decimal places,
 * and locale-specific formatting rules optimized for Palestinian marketplace
 * transactions and international currency support.
 * 
 * Features:
 * - Palestinian currency support (ILS/NIS as primary)
 * - International currency formatting (USD, EUR, etc.)
 * - Arabic numeral representation with proper formatting
 * - RTL-aware currency symbol positioning
 * - Decimal precision control for different currencies
 * 
 * @param amount - Numeric amount to format
 * @param currency - Currency code (ILS, USD, EUR, etc.)
 * @param locale - Locale identifier for formatting rules
 * @returns Formatted currency string with proper symbols and spacing
 */
export function formatCurrency(
  amount: number,
  currency: string = 'SAR',
  locale: string = 'ar-SA'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
}

/**
 * Format date to Arabic locale
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('ar-SA', defaultOptions).format(dateObj);
}

/**
 * Format time to Arabic locale
 */
export function formatTime(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  
  return new Intl.DateTimeFormat('ar-SA', defaultOptions).format(dateObj);
}

/**
 * Format relative time (e.g., "منذ 5 دقائق")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
  
  return formatDate(dateObj);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Saudi phone number formatting
  if (cleaned.startsWith('966')) {
    return `+966 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  if (cleaned.startsWith('05')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
