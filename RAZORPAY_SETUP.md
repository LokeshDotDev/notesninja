# Razorpay Setup Instructions

## Required Credentials

To integrate Razorpay, you need the following credentials from your Razorpay dashboard:

1. **RAZORPAY_KEY_ID** - Your Razorpay Key ID
2. **RAZORPAY_KEY_SECRET** - Your Razorpay Key Secret

## Steps to Get Razorpay Credentials

1. Sign up or log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate a new key pair (or use existing ones)
4. Copy the Key ID and Key Secret

## Environment Variables

Create a `.env` file in your project root and add:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## Important Notes

- Keep your credentials secure and never commit them to version control
- For development, you can use Razorpay test mode
- For production, you'll need to activate your Razorpay account and use production keys
- Make sure to add `.env` to your `.gitignore` file
