import notificationService from '../notifications/notifications.service';

class NotificationHelper {
  // Notification for new subscription plan
  static async notifyNewSubscriptionPlan(plan: any, adminId: string) {
    return await notificationService.sendNotification({
      title: "New Subscription Plan Available!",
      body: `Check out our new ${plan.name} plan with amazing features starting at $${plan.price}.`,
      type: 'both',
      category: 'subscription',
      sentBy: adminId,
      metadata: {
        planId: plan._id,
        planName: plan.name,
        planPrice: plan.price,
        actionUrl: `/subscription/plans/${plan._id}`
      }
    });
  }

  // Notification for new event
  static async notifyNewEvent(event: any, adminId: string) {
    return await notificationService.sendNotification({
      title: "New Event Available!",
      body: `${event.title} is now live! Join now and start betting.`,
      type: 'both',
      category: 'event',
      sentBy: adminId,
      metadata: {
        eventId: event._id,
        eventTitle: event.title,
        actionUrl: `/events/${event._id}`
      }
    });
  }

  // Notification for new promotion
  static async notifyNewPromotion(promotion: any, adminId: string) {
    return await notificationService.sendNotification({
      title: "New Promotion Available!",
      body: `${promotion.title} - ${promotion.discount}% off! Limited time offer.`,
      type: 'both',
      category: 'promotion',
      sentBy: adminId,
      metadata: {
        promotionId: promotion._id,
        promotionCode: promotion.code,
        discount: promotion.discount,
        actionUrl: `/promotions/${promotion._id}`
      }
    });
  }

  // Notification for system announcement
  static async notifySystemAnnouncement(title: string, body: string, adminId: string, metadata?: any) {
    return await notificationService.sendNotification({
      title,
      body,
      type: 'both',
      category: 'announcement',
      sentBy: adminId,
      metadata: {
        ...metadata,
        isSystemAnnouncement: true,
        priority: 'high'
      }
    });
  }

  // Notification for app updates
  static async notifyAppUpdate(version: string, features: string[], adminId: string) {
    return await notificationService.sendNotification({
      title: "App Update Available!",
      body: `Version ${version} is now available with exciting new features.`,
      type: 'both',
      category: 'app_update',
      sentBy: adminId,
      metadata: {
        version,
        features,
        updateRequired: false,
        actionUrl: '/app-update'
      }
    });
  }


  //notifyUserPlanActivation
  static async notifyUserPlanActivation(userId: string, planId: string) {
    return await notificationService.sendNotification({
      title: "Your Subscription Plan is Active!",
      body: `Your subscription plan (ID: ${planId}) is now active. Enjoy the benefits!`,
      type: 'both',
      category: 'subscription',
      sentBy: userId,
      metadata: {
        userId,
        planId
      }
    });
  }
}

export default NotificationHelper;