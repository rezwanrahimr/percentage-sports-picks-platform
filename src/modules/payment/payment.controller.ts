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
        event = stripe.webhooks.constructEvent(
            req.body, // raw Buffer thanks to express.raw
            sig,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        console.log("➡️ Stripe event:", event.type);

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as any;
                const stripeCustomerId = session.customer as string;

                let sub = await UserSubscriptionModel.findOne({
                    stripeCustomerId,
                    status: "pending",
                }).sort({ createdAt: -1 });

                if (!sub && session.metadata.userId && session.metadata.planId) {
                    sub = await UserSubscriptionModel.findOne({
                        userId: session.metadata.userId,
                        planId: session.metadata.planId,
                        status: "pending",
                    }).sort({ createdAt: -1 });
                }

                if (!sub) {
                    console.warn("No pending subscription found for session:", session.id);
                    break;
                }

                if (session.subscription) {
                    sub.stripeSubscriptionId = session.subscription;
                }
                sub.status = session.mode === "subscription" ? "active" : "completed"; // Subscription vs One-Time
                sub.startDate = new Date();

                if (sub.promoCodeId) {
                    await paymentService.markPromoUsedIfAny(String(sub.promoCodeId));
                }

                await sub.save();
                console.log("Subscription/One-time payment activated for user:", sub.userId.toString());
                break;
            }

            // Handle other cases (invoice.payment_succeeded, etc.) as before
        }


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