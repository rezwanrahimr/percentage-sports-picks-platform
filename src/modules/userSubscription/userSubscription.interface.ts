import mongoose from "mongoose";

export type TUserSubscription = {
    userId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    startDate?: Date;
    endDate?: Date | null;
    status: "active" | "canceled" | "past_due" | "inactive";
    promoCodeId?: mongoose.Types.ObjectId | null;
}