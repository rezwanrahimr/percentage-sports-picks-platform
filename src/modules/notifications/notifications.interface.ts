import { Request } from 'express';

export interface AuthUser {
  id?: string;
  email?: string;
  role?: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export interface SendNotificationRequest extends Request {
  body: {
    title: string;
    body: string;
    type: 'email' | 'push' | 'both';
    category: string;
    recipients?: string[]; // If empty, send to all users
    metadata?: any;
  };
}

export interface DeviceTokenRequest extends Request {
  body: {
    userId: string;
    deviceToken: string;
    platform: 'ios' | 'android';
  };
}

export interface NotificationStatusRequest extends Request {
  body: {
    notificationId: string;
    status: 'read' | 'unread';
  };
}

export interface NotificationQueryRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    category?: string;
    type?: string;
    status?: 'read' | 'unread' | 'all';
  };
}

export interface NotificationDetailsRequest extends Request {
  params: {
    notificationId: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}