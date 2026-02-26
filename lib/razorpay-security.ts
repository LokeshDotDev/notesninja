import crypto from 'crypto';

/**
 * Enhanced security utilities for Razorpay integration
 * Implements best practices from official Razorpay documentation
 */

export interface RazorpaySecurityConfig {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
  environment: 'production' | 'development' | 'test';
}

export class RazorpaySecurity {
  private config: RazorpaySecurityConfig;

  constructor(config: RazorpaySecurityConfig) {
    this.config = config;
    this.validateConfig();
  }

  /**
   * Validate configuration security
   */
  private validateConfig() {
    if (!this.config.keyId || !this.config.keySecret) {
      throw new Error('Razorpay credentials are required');
    }

    // In production, webhook secret is required
    if (this.config.environment === 'production' && !this.config.webhookSecret) {
      console.warn('⚠️ WARNING: Webhook secret not configured in production');
    }

    // Validate key format (should start with rzp_live_ or rzp_test_)
    const keyPrefix = this.config.environment === 'production' ? 'rzp_live_' : 'rzp_test_';
    if (!this.config.keyId.startsWith(keyPrefix)) {
      console.warn(`⚠️ WARNING: Key ID should start with ${keyPrefix} for ${this.config.environment}`);
    }
  }

  /**
   * Verify webhook signature with timing-safe comparison
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    if (!signature) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(body, 'utf8')
        .digest('hex');

      // Use timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch (error) {
      console.error('❌ Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Verify payment signature (for client-side callbacks)
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    if (!this.config.keySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch (error) {
      console.error('❌ Payment signature verification error:', error);
      return false;
    }
  }

  /**
   * Generate secure receipt ID
   */
  generateReceiptId(prefix: string = 'rcpt'): string {
    const timestamp = Date.now().toString(36);
    const randomStr = crypto.randomBytes(4).toString('hex');
    return `${prefix}_${timestamp}_${randomStr}`;
  }

  /**
   * Sanitize and validate notes
   */
  sanitizeNotes(notes: Record<string, any>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    
    Object.keys(notes).forEach(key => {
      if (typeof notes[key] === 'string' && notes[key].length <= 64) {
        sanitized[key] = notes[key];
      } else {
        sanitized[key] = String(notes[key]).substring(0, 64);
      }
    });

    return sanitized;
  }

  /**
   * Validate amount for security
   */
  validateAmount(amount: number): { isValid: boolean; error?: string } {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return { isValid: false, error: 'Amount must be a valid number' };
    }

    if (amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    // Maximum amount limit (prevent abuse)
    const maxAmount = this.config.environment === 'production' ? 100000 : 1000; // 1L INR in prod, 1K in test
    if (amount > maxAmount) {
      return { 
        isValid: false, 
        error: `Amount exceeds maximum limit of ${maxAmount}` 
      };
    }

    return { isValid: true };
  }

  /**
   * Check if webhook event is processed (idempotency)
   */
  static createEventTracker() {
    const processedEvents = new Map<string, number>();
    const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
    const EVENT_TTL = 30 * 60 * 1000; // 30 minutes

    // Cleanup old events periodically
    setInterval(() => {
      const now = Date.now();
      for (const [eventId, timestamp] of processedEvents.entries()) {
        if (now - timestamp > EVENT_TTL) {
          processedEvents.delete(eventId);
        }
      }
    }, CLEANUP_INTERVAL);

    return {
      isProcessed: (eventId: string): boolean => {
        return processedEvents.has(eventId);
      },
      
      markProcessed: (eventId: string): void => {
        processedEvents.set(eventId, Date.now());
      },
      
      getStats: () => {
        return {
          totalEvents: processedEvents.size,
          oldestEvent: Math.min(...Array.from(processedEvents.values()))
        };
      }
    };
  }

  /**
   * Environment-specific error messages
   */
  getErrorMessage(error: string): string {
    if (this.config.environment === 'production') {
      // Don't expose sensitive errors in production
      const safeErrors = [
        'Payment service temporarily unavailable',
        'Invalid payment details',
        'Payment processing failed',
        'Order creation failed'
      ];
      
      return safeErrors.includes(error) ? error : 'Payment processing failed';
    }
    
    return error; // Expose full error in development
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: string, data: any) {
    const logData = {
      timestamp: new Date().toISOString(),
      event,
      environment: this.config.environment,
      ...data
    };

    if (this.config.environment === 'production') {
      // In production, log without sensitive data
      console.log('🔒 SECURITY EVENT:', {
        ...logData,
        // Remove sensitive fields
        keyId: undefined,
        signature: undefined,
        body: undefined
      });
    } else {
      // In development, log everything for debugging
      console.log('🔒 SECURITY EVENT:', logData);
    }
  }
}

/**
 * Create security instance from environment variables
 */
export function createRazorpaySecurity(): RazorpaySecurity {
  const config: RazorpaySecurityConfig = {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    environment: (process.env.NODE_ENV as any) || 'development'
  };

  return new RazorpaySecurity(config);
}
