import { Request, Response } from 'express';
import {
  SendNotificationRequest,
  DeviceTokenRequest,
  NotificationStatusRequest,
  ApiResponse
} from './notifications.interface';
import notificationService from './notifications.service';
import { NotificationModel } from './notifications.model';
import catchAsync from '../../util/catchAsync';

class NotificationController {
  // Main dynamic send notification function
  sendNotification = catchAsync(async (req: SendNotificationRequest, res: Response<ApiResponse>): Promise<void> => {
    const { title, body, type, category, recipients, metadata } = req.body;
    const sentBy = req.user?.id;

    if (!sentBy) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
      return;
    }

    const result = await notificationService.sendNotification({
      title,
      body,
      type,
      category,
      recipients,
      sentBy,
      metadata
    });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Notification sent successfully',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to send notification'
      });
    }
  });

  // Register device token
  registerDeviceToken = catchAsync(async (req: DeviceTokenRequest, res: Response<ApiResponse>): Promise<void> => {
    const { userId, deviceToken, platform } = req.body;

    const userDevice = await notificationService.registerDeviceToken(userId, deviceToken, platform);

    res.status(200).json({
      success: true,
      message: 'Device token registered successfully',
      data: userDevice
    });
  });

  // Get recent notifications for user
  getRecentNotifications = catchAsync(async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const userId = req.user?.id;
    const { page = '1', limit = '10' } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
      return;
    }

    const result = await notificationService.getUserNotifications(
      userId,
      parseInt(page as string),
      parseInt(limit as string),
      'unread'
    );

    res.status(200).json({
      success: true,
      message: 'Recent notifications retrieved successfully',
      data: result
    });
  });

  // Get all notifications for user
  getAllNotifications = catchAsync(async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const userId = req.user?.id;
    const { page = '1', limit = '10', status = 'all' } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
      return;
    }

    const result = await notificationService.getUserNotifications(
      userId,
      parseInt(page as string),
      parseInt(limit as string),
      status === 'all' ? undefined : status as 'read' | 'unread'
    );

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: result
    });
  });

  // View specific notification details
  viewSpecificNotification = catchAsync(async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const { notificationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
      return;
    }

    const notification = await NotificationModel
      .findById(notificationId)
      // .populate('sentBy', 'name email')
      .lean();

    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }

    // Check if user is a recipient
    const isRecipient = notification.recipients.some(
      (recipientId: any) => recipientId.toString() === userId
    );

    if (!isRecipient) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You are not a recipient of this notification'
      });
      return;
    }

    // Mark as read if not already read
    const isRead = notification.readBy.some((read: any) => read.userId.toString() === userId);
    if (!isRead) {
      await notificationService.markAsRead(notificationId, userId);
    }

    res.status(200).json({
      success: true,
      message: 'Notification details retrieved successfully',
      data: {
        ...notification,
        isRead: true
      }
    });
  });

  // Change notification status (read/unread)
  changeNotificationStatus = catchAsync(async (req: NotificationStatusRequest, res: Response<ApiResponse>): Promise<void> => {
    const { notificationId, status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
      return;
    }

    if (status === 'read') {
      await notificationService.markAsRead(notificationId, userId);
    } else {
      // Remove from readBy array for unread
      await NotificationModel.findByIdAndUpdate(
        notificationId,
        {
          $pull: {
            readBy: { userId: userId }
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      message: `Notification marked as ${status} successfully`
    });
  });

  // Mark all notifications as read
  markAllAsRead = catchAsync(async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
      return;
    }

    await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read successfully'
    });
  });

  // Get all notifications for admin
  getAllNotificationForAdmin = catchAsync(async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    const { page = '1', limit = '10', category, type } = req.query;

    const result = await notificationService.getAdminNotifications(
      parseInt(page as string),
      parseInt(limit as string),
      category as string,
      type as string
    );

    res.status(200).json({
      success: true,
      message: 'Admin notifications retrieved successfully',
      data: result
    });
  });

  // Custom notification sender for admin testing
  sendCustomNotification = catchAsync(async (req: SendNotificationRequest, res: Response<ApiResponse>): Promise<void> => {
    const { title, body, type = 'both', category = 'custom', recipients, metadata } = req.body;
    const sentBy = req.user?.id;
    // const sentBy = '6895ce9a68bd56f92089f162';
    console.log(req.user);

    if (!sentBy) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found'
      });
      return;
    }

    const result = await notificationService.sendNotification({
      title,
      body,
      type,
      category,
      recipients,
      sentBy,
      metadata: {
        ...metadata,
        isCustom: true,
        sentAt: new Date().toISOString()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Custom notification sent successfully',
      data: result
    });
  });
}

export default new NotificationController();