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
    console.log('param data', user, planId, promoCode);
    const plan = await PlanModel.findById(planId);
    console.log('plan', plan);
    if (!plan) throw new Error("Plan not found");

    let promo: Partial<TPromoCode> | null = null;
    if (promoCode) {
        promo = await promoCodeModel.findOne({ code: promoCode });
        console.log('promo code', promo);
        if (!promo) throw new Error("Invalid promo code");
        if (promo.validUntil && promo.validUntil < new Date()) throw new Error("Promo expired");
    }

    const stripeCustomerId = await getOrCreateStripeCustomer(user);

    console.log('stripeCustomerId', stripeCustomerId);

    const sessionParams: any = {
        mode: plan.subscription ? "subscription" : "payment",
        customer: stripeCustomerId,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: plan.price * 100,
                    product_data: { name: plan.name },
                },
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        payment_method_types: ["card"],
    };

    if (plan.freeTrialDays && plan.subscription) {
        sessionParams.subscription_data = { trial_period_days: plan.freeTrialDays };
    }

    if (promo?.stripeCouponId) {
        sessionParams.discounts = [{ coupon: promo.stripeCouponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // create a pending subscription record to be updated in webhook
    await UserSubscriptionModel.create({
        userId: user.id,
        planId: plan._id,
        stripeCustomerId,
        status: "pending",
        promoCodeId: promo ? promo?._id : null
    });

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
            if (promo?.maxUses && promo?.usedCount >= promo?.maxUses) {
                throw new Error("Promo usage limit exceeded");
            }
            promo?.usedCount += 1;
            await promo?.save({ session: sess });
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