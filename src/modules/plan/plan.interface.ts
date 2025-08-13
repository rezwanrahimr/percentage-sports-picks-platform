import { Schema } from "mongoose";

export type TPlan = {
    name: string;
    price: number;
    stripePriceId?: string;
    services: Schema.Types.ObjectId[];
    freeTrialDays?: number;
    bestValue?: boolean;
    subscription?: boolean;
    billingInterval?: "week" | "month" | "year";
    oneTimePayment?: boolean;
    description?: string;
}