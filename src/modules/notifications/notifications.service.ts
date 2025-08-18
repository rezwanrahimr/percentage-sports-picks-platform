import admin from '../firebaseSetup/firebase';
import { NotificationModel, UserDeviceModel } from './notifications.model';
import mongoose from 'mongoose';
import { sendEmail } from '../../util/sendEmail';
import { UserModel } from '../user/user.model';

interface SendNotificationOptions {
  title: string;
  body: string;
  type: 'email' | 'push' | 'both';
  category: string;
  recipients?: string[]; // User IDs
  sentBy: string;
  metadata?: any;
}

interface NotificationResult {
  success: boolean;
  notificationId?: string;
  emailSent?: boolean;
  pushSent?: boolean;
  recipientCount?: number;
  error?: string;
}

class NotificationService {
  // Main dynamic notification function
  async sendNotification(options: SendNotificationOptions): Promise<NotificationResult> {
    try {
      const { title, body, type, category, recipients, sentBy, metadata = {} } = options;

      // Get recipients
      let targetUsers;
      if (recipients && recipients.length > 0) {
        targetUsers = await UserModel.find({ _id: { $in: recipients } });
      } else {
        targetUsers = await UserModel.find({ isActive: true });
      }

      if (targetUsers.length === 0) {
        return { success: false, error: 'No users found to send notification' };
      }

      // Filter users based on their notification preferences
      const emailRecipients = targetUsers.filter(user =>
        (type === 'email' || type === 'both') && user.isEmailNotification
      );
      const pushRecipients = targetUsers.filter(user =>
        (type === 'push' || type === 'both') && user.isPushNotification
      );

      // Save notification to database
      const notification = new NotificationModel({
        title,
        body,
        type,
        category,
        recipients: targetUsers.map(user => user._id),
        sentBy,
        metadata,
        emailSent: false,
        pushSent: false
      }) as mongoose.Document & { _id: mongoose.Types.ObjectId };

      await notification.save();

      let emailSent = false;
      let pushSent = false;

      // Send email notifications
      if (emailRecipients.length > 0) {
        try {
          await this.sendEmailNotifications(emailRecipients, title, body, metadata);
          emailSent = true;
          console.log(`📧 Email sent to ${emailRecipients.length} users`);
        } catch (error) {
          console.error('❌ Error sending email notifications:', error);
        }
      }

      // Send push notifications
      if (pushRecipients.length > 0) {
        try {
          await this.sendPushNotifications(pushRecipients, title, body, metadata);
          pushSent = true;
          console.log(`📱 Push notifications sent to ${pushRecipients.length} users`);
        } catch (error) {
          console.error('❌ Error sending push notifications:', error);
        }
      }

      // Update notification status
      await NotificationModel.findByIdAndUpdate(notification._id, {
        emailSent,
        pushSent
      });

      return {
        success: true,
        notificationId: notification._id.toString(),
        emailSent,
        pushSent,
        recipientCount: targetUsers.length
      };

    } catch (error: any) {
      console.error('❌ Error in sendNotification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send email notifications
  private async sendEmailNotifications(users: any[], title: string, body: string, metadata: any): Promise<void> {
    for (const user of users) {
      try {
        await sendEmail(
          user.email,
          title,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">${title}</h2>
              <p style="color: #666; line-height: 1.6;">${body}</p>
              ${metadata.actionUrl ? `<a href="${metadata.actionUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 16px;">View Details</a>` : ''}
            </div>
          `
        );
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
      }
    }
  }

  // Send push notifications
  private async sendPushNotifications(users: any[], title: string, body: string, metadata: any): Promise<void> {
    const userIds = users.map(user => user._id);
    const devices = await UserDeviceModel.find({
      userId: { $in: userIds },
      isActive: true
    });

    if (devices.length === 0) return;

    const tokens = devices.map(device => device.deviceToken);

    try {
      const message = {
        notification: { title, body },
        data: {
          type: metadata.type || 'general',
          category: metadata.category || 'notification',
          ...metadata
        }
      };

      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...message
      });

      console.log(`📱 Push notification result: ${response.successCount} success, ${response.failureCount} failed`);

      // Clean up invalid tokens
      if (response.failureCount > 0) {
        const invalidTokens: string[] = [];
        response.responses.forEach((resp, index) => {
          if (!resp.success) {
            invalidTokens.push(tokens[index]);
          }
        });

        if (invalidTokens.length > 0) {
          await UserDeviceModel.deleteMany({ deviceToken: { $in: invalidTokens } });
          console.log(`🗑️ Cleaned up ${invalidTokens.length} invalid tokens`);
        }
      }
    } catch (error) {
      console.error('Error sending push notifications:', error);
      throw error;
    }
  }

  // Register device token
  async registerDeviceToken(userId: string, deviceToken: string, platform: 'ios' | 'android'): Promise<any> {
    try {
      let userDevice = await UserDeviceModel.findOne({ deviceToken });

      if (userDevice) {
        userDevice.userId = new mongoose.Types.ObjectId(userId);
        userDevice.platform = platform;
        userDevice.isActive = true;
        userDevice.lastUsed = new Date();
        await userDevice.save();
      } else {
        userDevice = new UserDeviceModel({
          userId: new mongoose.Types.ObjectId(userId),
          deviceToken,
          platform,
          isActive: true
        });
        await userDevice.save();
      }

      return userDevice;
    } catch (error) {
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string, page: number = 1, limit: number = 10, status?: 'read' | 'unread'): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {
        recipients: new mongoose.Types.ObjectId(userId),
        isActive: true
      };

      if (status === 'read') {
        filter['readBy.userId'] = new mongoose.Types.ObjectId(userId);
      } else if (status === 'unread') {
        filter['readBy.userId'] = { $ne: new mongoose.Types.ObjectId(userId) };
      }

      const notifications = await NotificationModel
        .find(filter)
        // .populate('recipients', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await NotificationModel.countDocuments(filter);

      // Add read status for each notification
      const notificationsWithStatus = notifications.map(notification => ({
        ...notification,
        isRead: notification.readBy.some((read: any) => read.userId.toString() === userId)
      }));

      return {
        notifications: notificationsWithStatus,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      await NotificationModel.findByIdAndUpdate(
        notificationId,
        {
          $addToSet: {
            readBy: {
              userId: new mongoose.Types.ObjectId(userId),
              readAt: new Date()
            }
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const unreadNotifications = await NotificationModel.find({
        recipients: new mongoose.Types.ObjectId(userId),
        'readBy.userId': { $ne: new mongoose.Types.ObjectId(userId) },
        isActive: true
      });

      for (const notification of unreadNotifications) {
        await this.markAsRead((notification._id as mongoose.Types.ObjectId).toString(), userId);
      }
    } catch (error) {
      throw error;
    }
  }

  // Get admin notifications (all notifications)
  async getAdminNotifications(page: number = 1, limit: number = 10, category?: string, type?: string): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = { isActive: true };

      if (category) filter.category = category;
      if (type) filter.type = type;

      const notifications = await NotificationModel
        .find(filter)
        .populate('sentBy', 'name email')
        .populate('recipients', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await NotificationModel.countDocuments(filter);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new NotificationService();