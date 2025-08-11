import { Schema } from "mongoose";

export type TPlan = {
    name: string;
    price: number;
    services: Schema.Types.ObjectId[];
    freeTrialDays?: number;
    bestValue?: boolean;
    subscription?: boolean;
    oneTimePayment?: boolean;
}