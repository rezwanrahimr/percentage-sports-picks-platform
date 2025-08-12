import { Schema } from "mongoose";

export type TPromoCode = {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    validFrom: Date;
    validUntil: Date;
    usageLimit?: number;
    usedCount?: number;
};