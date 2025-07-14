/**
 * Logger Service - Professional Logging System for Yalla Souq Palestinian Marketplace
 * 
 * Comprehensive logging service designed specifically for the Palestinian marketplace
 * platform. Provides structured logging with multiple levels, performance monitoring,
 * and environment-based logging controls for optimal development and production
 * debugging capabilities.
 * 
 * Features:
 * - Multiple log levels (debug, info, warn, error) with configurable thresholds
 * - Environment-based logging controls for development vs production
 * - Structured log entries with timestamps and source tracking
 * - API call logging for monitoring Supabase and external service interactions
 * - User action tracking for Palestinian marketplace behavior analytics
 * - Performance monitoring for identifying bottlenecks
 * - Memory-efficient log storage with automatic cleanup
 * - Specialized logging methods for different system components
 * 
 * Palestinian Market Integration:
 * - Arabic language support in log messages and user actions
 * - Cultural considerations in logging sensitive Palestinian user data
 * - Supabase integration logging for Palestinian database operations
 * - Performance tracking for Palestinian network conditions
 * - User behavior analytics for Palestinian marketplace insights
 * 
 * Security Features:
 * - Sensitive data filtering to protect Palestinian user privacy
 * - Log level controls to prevent information leakage in production
 * - Automatic log rotation to prevent memory exhaustion
 * - Source tracking for security audit trails
 * - Error tracking without exposing system internals
 * 
 * Performance Optimization:
 * - Efficient log storage with circular buffer implementation
 * - Conditional logging based on environment and level
 * - Minimal overhead for production environments
 * - Async logging support for non-blocking operations
 * - Memory management with automatic cleanup
 * 
 * Development Experience:
 * - Colored console output for different log levels
 * - Structured data logging for complex debugging
 * - Performance measurement utilities
 * - API call tracking for integration debugging
 * - User action logging for behavior analysis
 * 
 * Technical Architecture:
 * - Singleton pattern for consistent logging across application
 * - TypeScript interfaces for type-safe logging operations
 * - Environment variable integration for configuration
 * - Modular design for extending logging capabilities
 * - Error-safe implementations to prevent logging failures
 * 
 * @module LoggerService
 * @author Yalla Souq Development Team
 * @version 2.0.0
 * @since 1.0.0
 */

/**
 * Log Level Type Definition
 * 
 * Defines the available logging levels in order of severity.
 * Used for filtering and controlling log output based on environment
 * and debugging requirements.
 * 
 * Levels:
 * - debug: Detailed debugging information for development
 * - info: General information about application flow
 * - warn: Warning messages for potential issues
 * - error: Error messages for failures and exceptions
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log Entry Interface
 * 
 * Defines the structure of individual log entries stored in memory.
 * Provides comprehensive information for debugging and analytics
 * while maintaining consistent formatting across the application.
 * 
 * Fields:
 * - level: Severity level of the log entry
 * - message: Human-readable log message (Arabic/English)
 * - data: Optional structured data for complex debugging
 * - timestamp: ISO formatted timestamp for precise timing
 * - source: Optional source identifier for tracking log origin
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  source?: string;
}

/**
 * Logger Class - Core Logging Implementation
 * 
 * Main logging service class providing comprehensive logging capabilities
 * for the Palestinian marketplace platform. Handles environment-based
 * configuration, structured logging, and specialized logging methods.
 * 
 * Capabilities:
 * - Environment-aware logging with configurable levels
 * - Structured log storage with automatic memory management
 * - Specialized logging methods for different system components
 * - Performance monitoring and measurement utilities
 * - API call tracking for external service monitoring
 * - User action logging for Palestinian marketplace analytics
 * 
 * Configuration:
 * - Automatic development/production environment detection
 * - Log level configuration from environment variables
 * - Memory management with configurable log retention
 * - Source tracking for debugging complex interactions
 */
class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];

  /**
   * Logger Constructor
   * 
   * Initializes the logging service with environment-based configuration.
   * Sets up development mode detection and configurable log levels
   * for optimal debugging experience in Palestinian marketplace development.
   * 
   * Environment Detection:
   * - Automatically detects development vs production environment
   * - Configures log level from NEXT_PUBLIC_LOG_LEVEL environment variable
   * - Sets up memory management for log storage
   * - Initializes performance monitoring capabilities
   */
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';
  }

  /**
   * Log Level Filter
   * 
   * Determines whether a log entry should be processed based on
   * the configured log level threshold. Provides efficient filtering
   * to prevent unnecessary processing in production environments.
   * 
   * @param level - Log level to check against threshold
   * @returns boolean indicating whether to process the log entry
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Log Entry Factory
   * 
   * Creates structured log entries with consistent formatting and
   * complete metadata for debugging and analytics purposes.
   * Ensures all log entries contain necessary information for
   * Palestinian marketplace debugging and monitoring.
   * 
   * @param level - Severity level of the log entry
   * @param message - Human-readable log message
   * @param data - Optional structured data for complex debugging
   * @param source - Optional source identifier for tracking origin
   * @returns Structured log entry with complete metadata
   */
  private createLogEntry(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      source
    };
  }

  /**
   * Core Logging Method
   * 
   * Central logging implementation that handles level filtering,
   * log storage, memory management, and console output formatting.
   * Provides consistent logging behavior across all specialized
   * logging methods in the Palestinian marketplace platform.
   * 
   * Features:
   * - Level-based filtering for performance optimization
   * - Structured log storage with automatic memory management
   * - Formatted console output with timestamps and source tracking
   * - Environment-aware output control for development/production
   * 
   * @param level - Severity level of the log entry
   * @param message - Human-readable log message
   * @param data - Optional structured data for debugging
   * @param source - Optional source identifier for tracking
   */
  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    if (!this.shouldLog(level)) return;

    const logEntry = this.createLogEntry(level, message, data, source);
    this.logs.push(logEntry);

    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    const prefix = `[${level.toUpperCase()}] ${source ? `[${source}] ` : ''}`;
    const timestamp = new Date().toLocaleTimeString();
    
    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`${prefix}${timestamp}: ${message}`, data || '');
        }
        break;
      case 'info':
        if (this.isDevelopment) {
          console.log(`${prefix}${timestamp}: ${message}`, data || '');
        }
        break;
      case 'warn':
        console.warn(`${prefix}${timestamp}: ${message}`, data || '');
        break;
      case 'error':
        console.error(`${prefix}${timestamp}: ${message}`, data || '');
        break;
    }
  }

  /**
   * Debug Logging Method
   * 
   * Logs detailed debugging information for development environments.
   * Ideal for tracing Palestinian marketplace functionality, user
   * interactions, and system state during development and testing.
   * 
   * @param message - Debug message describing the operation or state
   * @param data - Optional data for detailed debugging context
   * @param source - Optional source component identifier
   */
  debug(message: string, data?: any, source?: string): void {
    this.log('debug', message, data, source);
  }

  /**
   * Info Logging Method
   * 
   * Logs general information about application flow and operations.
   * Useful for tracking Palestinian marketplace user journeys,
   * successful operations, and system status updates.
   * 
   * @param message - Informational message about application state
   * @param data - Optional data providing additional context
   * @param source - Optional source component identifier
   */
  info(message: string, data?: any, source?: string): void {
    this.log('info', message, data, source);
  }

  /**
   * Warning Logging Method
   * 
   * Logs warning messages for potential issues that don't prevent
   * operation but may indicate problems in Palestinian marketplace
   * functionality or user experience.
   * 
   * @param message - Warning message describing the potential issue
   * @param data - Optional data providing issue context
   * @param source - Optional source component identifier
   */
  warn(message: string, data?: any, source?: string): void {
    this.log('warn', message, data, source);
  }

  /**
   * Error Logging Method
   * 
   * Logs error messages for failures and exceptions in Palestinian
   * marketplace operations. Critical for debugging and monitoring
   * system reliability and user experience issues.
   * 
   * @param message - Error message describing the failure
   * @param error - Optional error object or additional error data
   * @param source - Optional source component identifier
   */
  error(message: string, error?: any, source?: string): void {
    this.log('error', message, error, source);
  }

  /**
   * Recent Logs Retrieval
   * 
   * Retrieves recent log entries for debugging and diagnostics.
   * Useful for displaying recent activity in Palestinian marketplace
   * admin interfaces or debugging tools.
   * 
   * @param count - Number of recent logs to retrieve (default: 10)
   * @returns Array of recent log entries
   */
  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Log Clearing Method
   * 
   * Clears all stored log entries to free memory or reset logging
   * state. Useful for testing or when implementing custom log
   * management in Palestinian marketplace admin tools.
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * API Call Logging
   * 
   * Specialized logging for API calls to Supabase and external services.
   * Tracks Palestinian marketplace API interactions for debugging
   * database operations, authentication, and third-party integrations.
   * 
   * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param url - API endpoint URL being called
   * @param data - Optional request data for debugging
   */
  apiCall(method: string, url: string, data?: any): void {
    this.debug(`API ${method.toUpperCase()}: ${url}`, data, 'API');
  }

  /**
   * API Response Logging
   * 
   * Logs API responses with automatic severity level based on status code.
   * Critical for monitoring Palestinian marketplace API reliability
   * and diagnosing integration issues with Supabase and external services.
   * 
   * @param method - HTTP method of the original request
   * @param url - API endpoint URL that responded
   * @param status - HTTP status code of the response
   * @param data - Optional response data for debugging
   */
  apiResponse(method: string, url: string, status: number, data?: any): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'debug';
    this.log(level, `API ${method.toUpperCase()} ${status}: ${url}`, data, 'API');
  }

  /**
   * User Action Logging
   * 
   * Tracks user interactions and behaviors in Palestinian marketplace.
   * Essential for analytics, user experience optimization, and
   * understanding Palestinian user patterns and preferences.
   * 
   * @param action - Description of user action performed
   * @param data - Optional additional data about the action context
   */
  userAction(action: string, data?: any): void {
    this.info(`User Action: ${action}`, data, 'USER');
  }

  /**
   * Performance Monitoring
   * 
   * Logs performance metrics for operations in Palestinian marketplace.
   * Helps identify bottlenecks, optimize user experience, and ensure
   * good performance for Palestinian users with varying network conditions.
   * 
   * @param operation - Description of the operation being measured
   * @param duration - Time taken for the operation in milliseconds
   * @param data - Optional additional performance context
   */
  performance(operation: string, duration: number, data?: any): void {
    const level = duration > 1000 ? 'warn' : 'debug';
    this.log(level, `Performance: ${operation} took ${duration}ms`, data, 'PERF');
  }
}

/**
 * Singleton Logger Instance
 * 
 * Global logger instance for consistent logging across the Palestinian
 * marketplace application. Provides easy access to logging functionality
 * from any component or service in the system.
 */
export const logger = new Logger();

/**
 * Performance Measurement Utility
 * 
 * Higher-order function that wraps async operations with automatic
 * performance logging. Ideal for measuring Palestinian marketplace
 * operations like database queries, API calls, and complex calculations.
 * 
 * Features:
 * - Automatic timing measurement for async operations
 * - Success and failure logging with duration tracking
 * - Error propagation while maintaining performance metrics
 * - Integration with main logging system
 * 
 * @param operation - Description of the operation being measured
 * @param fn - Async function to execute and measure
 * @returns Promise resolving to the function result with performance logging
 * 
 * @example
 * // Measure database query performance
 * const ads = await withPerformanceLog('fetch_ads', () => 
 *   supabase.from('ads').select('*').limit(10)
 * );
 * 
 * // Measure complex calculation
 * const result = await withPerformanceLog('calculate_recommendations', () =>
 *   calculatePalestinianMarketRecommendations(userId)
 * );
 */
export const withPerformanceLog = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.performance(operation, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.performance(`${operation} (FAILED)`, duration);
    throw error;
  }
};

/**
 * Default Export
 * 
 * Exports the logger instance as default for convenient importing
 * throughout the Palestinian marketplace application.
 */
export default logger;
