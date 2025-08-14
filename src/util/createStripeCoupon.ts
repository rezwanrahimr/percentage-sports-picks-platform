import { stripe } from "../config";
import { TPromoCode } from "../modules/promoCode/promoCode.interface";

async function createStripeCoupon(promo: TPromoCode): Promise<string> {
    // Depending on the discount type (percentage or fixed), create the coupon
    let coupon;
    if (promo.discountType === "percentage") {
        coupon = await stripe.coupons.create({
            percent_off: promo.discountValue,  // Percentage discount
            duration: "forever",  // "forever" means the discount applies indefinitely
        });
    } else if (promo.discountType === "fixed") {
        coupon = await stripe.coupons.create({
            amount_off: promo.discountValue * 100,  // Fixed discount in cents
            currency: "usd",  // Use the correct currency
            duration: "once",  // Apply once for the user
        });
    } else {
        throw new Error("Unsupported discount type");  // Handle unsupported discount types
    }

    // Save the created Stripe coupon ID to the promo code in your database
    promo.stripeCouponId = coupon.id;
    // Update the promo code in your database using your data access method
    // Example: await PromoCodeModel.update({ _id: promo._id }, { stripeCouponId: coupon.id });
    // Replace the following line with your actual update logic:
    // await updatePromoCodeStripeCouponId(promo._id, coupon.id);

    // Return the Stripe coupon ID
    return coupon.id;
}

export default createStripeCoupon;
