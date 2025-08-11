import mongoose, { Schema } from "mongoose";
import { TPlan } from "./plan.interface";

const planSchema = new Schema<TPlan>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    services: { type: [Schema.Types.ObjectId], ref: "Service", required: true },
    freeTrialDays: { type: Number, default: 0 },
    bestValue: { type: Boolean, default: false },
    subscription: { type: Boolean, default: false },
    oneTimePayment: { type: Boolean, default: false },
});

export const PlanModel = mongoose.model("planCollection", planSchema);