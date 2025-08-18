import mongoose, { Document, Schema } from 'mongoose';

// Import User model to register it with mongoose
import '../user/user.model'; // This line registers the User model

export interface INotification extends Document {
  title: string;
  body: string;
  type: 'email' | 'push' | 'both';
  category: string;
  recipients: mongoose.Types.ObjectId[];
  sentBy: mongoose.Types.ObjectId;
  sentAt: Date;
  emailSent: boolean;
  pushSent: boolean;
  readBy: {
    userId: mongoose.Types.ObjectId;
    readAt: Date;
  }[];
  metadata?: any;
  isActive: boolean;
}

const notificationSchema = new Schema<INotification>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['email', 'push', 'both'], required: true },
  category: { type: String, required: true },
  recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sentBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sentAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false },
  pushSent: { type: Boolean, default: false },
  readBy: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  metadata: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);

// Keep your existing UserDevice model
export interface IUserDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceToken: string;
  platform: 'ios' | 'android';
  isActive: boolean;
  lastUsed: Date;
}

const userDeviceSchema = new Schema<IUserDevice>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deviceToken: { type: String, required: true, unique: true },
  platform: { type: String, enum: ['ios', 'android'], required: true },
  isActive: { type: Boolean, default: true },
  lastUsed: { type: Date, default: Date.now }
}, { timestamps: true });

export const UserDeviceModel = mongoose.model<IUserDevice>('UserDevice', userDeviceSchema);