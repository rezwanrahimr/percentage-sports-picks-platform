import { Request, Response } from "express";
import paymentService from "./payment.service";
import { stripe } from "../../config";
import { UserSubscriptionModel } from "../userSubscription/userSubscription.model";
import catchAsync from "../../util/catchAsync";

const createCheckout = catchAsync(async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { planId, promoCode } = req.body;
        const successUrl = `${process.env.FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.FRONTEND_URL}/purchase-cancel`;

        console.log(user, planId, promoCode);

        const session = await paymentService.createCheckoutSession({
            user,
            planId,
            promoCode,
            successUrl,
            cancelUrl
        });

        res.json({ url: session.url, id: session.id });
    } catch (err: any) {
        console.error("createCheckout error:", err.message);
        return res.status(400).json({ message: err.message });
    }
});

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err: any) {
        console.error("⚠️  Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as any; // Stripe.Session
                const stripeCustomerId = session.customer as string;
                // find the most recent pending subscription record for this customer
                const sub = await UserSubscriptionModel.findOne({ stripeCustomerId, status: "pending" }).sort({ createdAt: -1 });
                if (!sub) break;

                // if subscription mode, session.subscription contains stripe subscription id
                if (session.subscription) {
                    sub.stripeSubscriptionId = session.subscription;
                    sub.status = "active";
                    sub.startDate = new Date();
                    // leave endDate to invoice events or subscriptions events
                } else {
                    // one-time payment
                    sub.status = "active";
                    sub.startDate = new Date();
                    // optionally set endDate = now + 30 days depending on plan logic
                }

                // increment promo usedCount inside a transaction if promo present
                if (sub.promoCodeId) {
                    await paymentService.markPromoUsedIfAny(sub.promoCodeId.toString());
                }

                await sub.save();
                break;
            }

            case "invoice.payment_succeeded": {
                const invoice = event.data.object as any;
                const stripeSubscriptionId = invoice.subscription;
                if (!stripeSubscriptionId) break;
                const sub = await UserSubscriptionModel.findOne({ stripeSubscriptionId });
                if (!sub) break;
                sub.status = "active";
                if (invoice.period_end) sub.endDate = new Date(invoice.period_end * 1000);
                await sub.save();
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as any;
                const stripeSubscriptionId = invoice.subscription;
                if (!stripeSubscriptionId) break;
                const sub = await UserSubscriptionModel.findOne({ stripeSubscriptionId });
                if (sub) {
                    sub.status = "past_due";
                    await sub.save();
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as any;
                const stripeSubscriptionId = subscription.id;
                const sub = await UserSubscriptionModel.findOne({ stripeSubscriptionId });
                if (sub) {
                    sub.status = "canceled";
                    sub.endDate = new Date(subscription.current_period_end * 1000);
                    await sub.save();
                }
                break;
            }

            default:
                // console.log(`Unhandled event type ${event.type}`);
                break;
        }

        // record event.id in your EventLog collection if you want idempotency
        res.json({ received: true });
    } catch (err: any) {
        console.error("Webhook processing error:", err);
        res.status(500).send();
    }
});

const paymentController = {
    createCheckout,
    stripeWebhook
};

export default paymentController;