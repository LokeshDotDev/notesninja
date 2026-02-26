# Razorpay Security Implementation Guide

## Overview

This guide covers the production-ready Razorpay implementation with enhanced security features following official Razorpay documentation and best practices.

## 🚨 Critical Security Requirements

### 1. Environment Variables

Add these to your `.env` file:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX  # Use rzp_live_ for production
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=XXXXXXXXXXXXXXXXXXXXX  # Required for webhooks

# Environment
NODE_ENV=production  # or development/test
```

### 2. Webhook Setup

1. **In Razorpay Dashboard** → Settings → Webhooks
2. **Add webhook URL**: `https://21ff-2409-40d4-2007-2abf-90b-76e4-addd-218e.ngrok-free.app/api/webhooks/razorpay`
3. **Subscribe to events**:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

4. **Webhook Secret**: Copy the secret to `RAZORPAY_WEBHOOK_SECRET`

### 3. Security Features Implemented

#### ✅ Signature Verification
- **Payment signatures**: Client-side payment verification
- **Webhook signatures**: Server-side event verification
- **Timing-safe comparison**: Prevents timing attacks

#### ✅ Idempotency Handling
- **Duplicate event prevention**: Tracks processed webhook events
- **Event TTL**: Automatic cleanup of old events
- **Memory management**: Prevents memory leaks

#### ✅ Environment Security
- **Production vs Development**: Different error messages
- **Key validation**: Ensures correct key types (rzp_live_/rzp_test_)
- **Secret protection**: No logging of sensitive data

#### ✅ Input Validation
- **Amount limits**: Prevents abuse (1L INR max in production)
- **Receipt ID generation**: Secure, unique identifiers
- **Notes sanitization**: Limits note length and content

## 📁 File Structure

```
app/api/
├── razorpay/
│   ├── create-order/route.ts      # Enhanced order creation
│   ├── verify-payment/route.ts    # Secure payment verification
│   └── capture-payment/route.ts   # Payment capture API
└── webhooks/
    └── razorpay/route.ts          # Webhook handler

lib/
└── razorpay-security.ts           # Security utilities
```

## 🔧 API Endpoints

### 1. Create Order
```
POST /api/razorpay/create-order
```

**Request Body**:
```json
{
  "amount": 299.99,
  "currency": "INR",
  "receipt": "custom_receipt_id",
  "notes": {
    "productId": "prod_123",
    "customerEmail": "user@example.com"
  }
}
```

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_XXXXXXXXXXXXXX",
    "amount": 29999,
    "currency": "INR",
    "receipt": "rcpt_123456"
  },
  "keyId": "rzp_test_XXXXXXXXXXXXXX",
  "webhookConfigured": true,
  "environment": "production"
}
```

### 2. Verify Payment
```
POST /api/razorpay/verify-payment
```

**Request Body**:
```json
{
  "razorpay_order_id": "order_XXXXXXXXXXXXXX",
  "razorpay_payment_id": "pay_XXXXXXXXXXXXXX",
  "razorpay_signature": "XXXXXXXXXXXXXXXXXXXXX",
  "productId": "prod_123",
  "customerEmail": "user@example.com",
  "customerName": "John Doe",
  "userId": "user_123"
}
```

### 3. Webhook Handler
```
POST /api/webhooks/razorpay
```

**Headers**:
- `X-Razorpay-Signature`: Webhook signature
- `X-Razorpay-Event-ID`: Unique event ID

## 🛡️ Security Best Practices

### 1. Never Trust Client-Side
- Always verify payments server-side
- Use webhooks for reliable payment status
- Implement proper signature verification

### 2. Environment Separation
```bash
# Development
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX

# Production
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
```

### 3. Error Handling
- **Production**: Generic error messages
- **Development**: Detailed error information
- **Logging**: Security event tracking

### 4. Rate Limiting
Consider implementing rate limiting on:
- Order creation endpoint
- Payment verification endpoint
- Webhook endpoint

## 🔄 Payment Flow

### Standard Flow
1. **Create Order** → Server generates Razorpay order
2. **Client Payment** → User pays via Razorpay modal
3. **Payment Verification** → Server verifies signature
4. **Webhook Confirmation** → Server receives webhook event
5. **Fulfillment** → Send email, grant access

### Late Authorization Handling
- **Webhook Event**: `payment.authorized`
- **Action**: Capture payment or notify admin
- **Benefit**: Catches payments that complete later

## 📊 Monitoring & Logging

### Security Events Logged
- Payment verification attempts
- Signature verification results
- Webhook event processing
- Configuration validation

### Error Tracking
- Failed signature verification
- Missing environment variables
- Database operation failures
- Webhook processing errors

## 🚀 Production Deployment Checklist

### 1. Environment Setup
- [ ] Set production Razorpay keys (`rzp_live_`)
- [ ] Configure webhook secret
- [ ] Set `NODE_ENV=production`
- [ ] Update webhook URL to production domain

### 2. Security Validation
- [ ] Test webhook signature verification
- [ ] Verify payment signature verification
- [ ] Test error handling in production
- [ ] Validate amount limits

### 3. Testing
- [ ] Test successful payment flow
- [ ] Test failed payment scenarios
- [ ] Test webhook delivery
- [ ] Test late authorization handling

### 4. Monitoring
- [ ] Set up error monitoring
- [ ] Configure security alerts
- [ ] Monitor webhook delivery
- [ ] Track payment success rates

## 🔍 Debugging

### Common Issues

1. **Webhook Not Receiving**
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check firewall/network settings

2. **Signature Verification Failed**
   - Ensure webhook secret is correct
   - Check raw body parsing (no JSON parsing)
   - Verify encoding (UTF-8)

3. **Payment Not Captured**
   - Check auto-capture settings
   - Verify webhook event handling
   - Check payment authorization status

### Debug Mode
Set `NODE_ENV=development` to get detailed error messages and logging.

## 📞 Support

### Razorpay Documentation
- [Security Checklist](https://razorpay.com/docs/security/checklist/)
- [Webhooks Guide](https://razorpay.com/docs/webhooks/)
- [API Documentation](https://razorpay.com/docs/api/)

### Common Issues
- Webhook signature mismatch
- Late payment authorization
- Duplicate webhook events
- Environment configuration errors

---

**⚠️ Important**: Never commit API keys or secrets to version control. Always use environment variables for sensitive configuration.
