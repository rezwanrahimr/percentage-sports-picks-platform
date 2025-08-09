import mongoose, { Schema } from "mongoose";
import { TVerificationCode } from "./auth.interface";

const VerificationCodeSchema = new Schema<TVerificationCode>({
  email: { type: String, required: true,unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const VerificationCodeModel = mongoose.model<TVerificationCode>("VerificationCode", VerificationCodeSchema);

export default VerificationCodeModel;