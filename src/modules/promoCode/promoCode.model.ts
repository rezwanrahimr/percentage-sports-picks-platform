import { model, Schema } from "mongoose";
import { TPromoCode } from "./promoCode.interface";

const PromoCodeSchema = new Schema<TPromoCode>({
    code: { type: String, unique: true, required: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    stripeCouponId: { type: String, unique: true },
}, { timestamps: true });

export default model<TPromoCode>("PromoCodeModel", PromoCodeSchema);