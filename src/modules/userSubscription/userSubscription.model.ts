import mongoose, { Schema, Document } from "mongoose";
import { TUserSubscription } from "./userSubscription.interface";

const userSubscriptionSchema = new Schema<TUserSubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  status: { type: String, enum: ["active", "canceled", "pending", "inactive"], default: "inactive" },
  promoCodeId: { type: Schema.Types.ObjectId, ref: "PromoCode", default: null },
}, { timestamps: true });

export const UserSubscriptionModel = mongoose.model<TUserSubscription>("UserSubscription", userSubscriptionSchema);
