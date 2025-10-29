"# Percentage - Sports Picks Platform

A comprehensive backend system for a sports betting picks platform with subscription management, real-time notifications, and payment processing capabilities.

## 🚀 Overview

Percentage is a full-featured sports betting picks management platform that enables users to subscribe to premium sports picks, manage subscriptions, and receive real-time notifications. The platform supports multiple authentication methods, subscription tiers with free trials, and integrates with Stripe for secure payment processing.

## 🛠️ Technologies

- **Backend Framework:** Node.js, Express.js, TypeScript
- **Database:** MongoDB, Mongoose ODM
- **Authentication:** JWT, Google OAuth, Apple Sign-In
- **Payment Processing:** Stripe API (Subscriptions & One-time Payments)
- **Notifications:** Firebase Cloud Messaging (FCM), SendGrid Email
- **Image Storage:** Cloudinary
- **Validation:** Zod
- **DevOps:** Docker, Docker Compose

## ✨ Key Features

### Authentication & User Management
- Multi-provider authentication (Email with verification code, Google OAuth, Apple Sign-In)
- Email verification with 6-digit OTP (5-minute expiry)
- JWT-based access and refresh token system
- User role management (Admin/User)
- Profile management with notification preferences

### Sports Picks Management
- Comprehensive sports betting picks system
- Support for multiple sports types, leagues, and teaser types
- Team management with image uploads (Cloudinary integration)
- Pick creation with multiple team details (date, time, point spread)
- Risk and win amount tracking
- Complete CRUD operations for sports entities

### Subscription & Payment System
- Flexible subscription plans (weekly, monthly, yearly)
- One-time payment support
- Free trial periods for subscriptions
- Stripe checkout session integration
- Promo code system with usage tracking and expiry
- Automatic Stripe coupon creation
- Webhook integration for payment confirmations
- Subscription status management (active, inactive, cancelled)

### Notification System
- Dynamic notification engine supporting email and push notifications
- Firebase Cloud Messaging (FCM) for real-time push notifications
- SendGrid integration for email notifications
- User device token management (iOS/Android)
- Notification preferences (enable/disable email/push per user)
- Admin bulk notification support
- Notification categories and metadata
- Read/unread status tracking
- Notification history with pagination

### Admin Features
- Admin seeder for initial setup
- Complete admin panel capabilities
- Bulk notification sending
- Subscription management and monitoring
- User management and analytics
- Payment and transaction tracking

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
├── modules/
│   ├── auth/              # Authentication & authorization
│   ├── user/              # User management
│   ├── plan/              # Subscription plans
│   ├── payment/           # Stripe payment processing
│   ├── pick/              # Sports picks management
│   ├── promoCode/         # Promotional codes
│   ├── userSubscription/  # User subscription tracking
│   ├── notifications/     # Notification service
│   └── firebaseSetup/     # Firebase configuration
├── middleware/            # Express middlewares
├── error/                 # Custom error handlers
├── util/                  # Utility functions
├── routes/                # API routes
└── seeder/               # Database seeders
```

## 🔧 API Modules

- **Auth API:** Login, Logout, Email verification, OAuth integration
- **User API:** Profile management, preferences, user CRUD
- **Plan API:** Subscription plan management
- **Payment API:** Checkout sessions, webhooks, subscription updates
- **Pick API:** Sports picks, teams, leagues, teasers management
- **Notification API:** Send notifications, device registration, mark as read
- **PromoCode API:** Coupon management and validation

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Zod schema validation for all inputs
- Password hashing with bcrypt
- CORS configuration
- Global error handling middleware
- Route-level authentication guards
- Stripe webhook signature verification

## 📧 Email & Notification Features

- Beautifully styled HTML email templates
- Email verification codes with modern UI
- Welcome emails for new users
- Notification preference management
- Multi-channel notification support (email + push)
- Device token management for push notifications
- Notification categorization and filtering

## 💳 Payment Features

- Stripe checkout session creation
- Subscription and one-time payment support
- Promo code discount application
- Free trial period support
- Automatic customer creation in Stripe
- Webhook handling for payment events
- Transaction tracking and history
- Subscription lifecycle management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Docker (optional)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with required configurations

# Run in development mode
npm run start:dev

# Build for production
npm run build

# Run production server
npm run start:prod
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📝 Environment Variables

Required environment variables:
- `MONGOOSE_URI`: MongoDB connection string
- `PORT`: Server port
- `JWT_TOKEN_SECRET`: JWT access token secret
- `JWT_REFRESH_TOKEN_SECRET`: JWT refresh token secret
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `SENDGRID_API_KEY`: SendGrid API key
- `CLOUDINARY_*`: Cloudinary configuration
- Firebase Admin SDK credentials

## 🎯 Key Achievements

- Built a scalable subscription-based platform handling multiple payment types
- Implemented comprehensive notification system with multi-channel support
- Integrated multiple OAuth providers for seamless authentication
- Created modular architecture with reusable service patterns
- Developed robust error handling and validation system
- Implemented Stripe webhooks for real-time payment processing
- Built dynamic promo code system with automatic coupon creation

## 📄 License

This project is proprietary software.