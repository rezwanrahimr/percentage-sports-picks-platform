import mongoose, { Schema } from 'mongoose';
import { userRole } from "../../constents";
import { TUser } from './user.interface';


const UserSchema = new Schema<TUser>({
    name: { type: String, required: false, default: "user" },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user"], default: userRole.user },
    title: { type: String, default: null },
    provider: { type: String, enum: ["email", "google", "apple"] },
    providerId: { type: String },
    img: { type: String, default: null },
    isNotificationEnabled: { type: Boolean, default: true },
    isLoggedIn: { type: Boolean, default: false },
    loggedOutTime: { type: Date },
    fcmToken: { type: String },
    isEmailNotification: { type: Boolean, default: true },
    isPushNotification: { type: Boolean, default: true },
}, { timestamps: true });



export const UserModel = mongoose.model("UserCollection", UserSchema);





