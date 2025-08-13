import mongoose from "mongoose";
import { stripe } from "../../config";
import { PlanModel } from "../plan/plan.model";
import promoCodeModel from "../promoCode/promoCode.model";
import { TPromoCode } from "../promoCode/promoCode.interface";
import { UserSubscriptionModel } from "../userSubscription/userSubscription.model";

export async function getOrCreateStripeCustomer(user: any) {
    if (user.stripeCustomerId) return user.stripeCustomerId;
    const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
    });
    return customer.id;
}


/**
 * Create a Checkout Session for a plan (subscription or one-time).
 * Returns session object (session.url and session.id).
 */

export async function createCheckoutSession(params: {
    user: any,
    planId: string,
    promoCode?: string | null,
    successUrl: string,
    cancelUrl: string,
}) {
    const { user, planId, promoCode, successUrl, cancelUrl } = params;

    const plan = await PlanModel.findById(planId);
    if (!plan) throw new Error("Plan not found");

    let promo: (Partial<TPromoCode> & { _id?: any }) | null = null;
    if (promoCode) {
        promo = await promoCodeModel.findOne({ code: promoCode });
        if (!promo) throw new Error("Invalid promo code");
        if (promo.validUntil && promo.validUntil < new Date()) throw new Error("Promo expired");
    }

    const stripeCustomerId = await getOrCreateStripeCustomer(user);

    // Define session parameters
    const sessionParams: any = {
        customer: stripeCustomerId,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: plan.price * 100,
                    product_data: { name: plan.name },
                    recurring: plan.subscription
                        ? { interval: plan.billingInterval } // Only if it's a subscription
                        : undefined,
                },
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_method_types: ["card"],
    };

    // If it's a subscription plan, set the session as a subscription
    if (plan.subscription) {
        sessionParams.mode = "subscription";
        if (plan.freeTrialDays) {
            sessionParams.subscription_data = { trial_period_days: plan.freeTrialDays };
        }
    } else if (plan.oneTimePayment) {
        sessionParams.mode = "payment"; // For one-time payments
    }

    // Apply promo code if applicable
    if (promo?.stripeCouponId) {
        sessionParams.discounts = [{ coupon: promo.stripeCouponId }];
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Create a UserSubscription record to save subscription details
    const userSubscription = new UserSubscriptionModel({
        userId: user.id,
        planId: plan._id,
        stripeCustomerId,
        price: plan.price, // Set the price from the plan
        type: plan.subscription ? "subscription" : "one_time", // Determine type
        status: "pending",
        transactionId: session.id, // Session ID as the transaction ID
        startDate: plan.subscription ? new Date() : null, // Set start date if it's a subscription
        endDate: plan.subscription ? null : new Date(), // Set end date if it's a one-time payment
        promoCodeId: promo ? promo._id : null, // Apply promo code if available
    });

    await userSubscription.save(); // Save subscription record

    return session;
}


/**
 * Safely increment promo usedCount when a payment is confirmed.
 * Uses a mongoose transaction to avoid race conditions (Atlas replica set required).
 */
export async function markPromoUsedIfAny(promoId: string | null) {
    if (!promoId) return;
    const sess = await mongoose.startSession();
    try {
        await sess.withTransaction(async () => {
            const promo = await promoCodeModel.findById(promoId).session(sess);
            if (!promo) throw new Error("Promo not found in transaction");
            if (promo?.maxUses && (typeof promo.usedCount === "number" ? promo.usedCount : 0) >= promo.maxUses) {
                throw new Error("Promo usage limit exceeded");
            }
            promo.usedCount = (typeof promo.usedCount === "number" ? promo.usedCount : 0) + 1;
            await promo.save({ session: sess });
        });
    } finally {
        sess.endSession();
    }
}


const paymentService = {
    createCheckoutSession,
    markPromoUsedIfAny
};
export default paymentService;