import idConverter from "../../util/idConvirter";
import { UserSubscriptionModel } from "./userSubscription.model";

const getUserById = async (userId: string) => {
    const id = idConverter(userId);
    const result = await UserSubscriptionModel.find({ userId: id }).populate('userId planId promoCodeId');
    if (!result || result.length === 0) {
        throw new Error("Subscription not found");
    }
    return result;
};

const getTotalSubscribers = async () => {
    try {
        const result = await UserSubscriptionModel.find({ type: 'subscription' }).countDocuments();
        return result;
    } catch (error) {
        console.error("Error fetching total subscribers:", error);
        throw new Error("Error fetching total subscribers");
    }
};

const getActiveSubscribers = async () => {
    try {
        const result = await UserSubscriptionModel.find({ type: 'subscription', status: 'active' }).countDocuments();
        return result;
    } catch (error) {
        console.error("Error fetching active subscribers:", error);
        throw new Error("Error fetching active subscribers");
    }
};

const userSubscriptionService = {
    getUserById,
    getTotalSubscribers,
    getActiveSubscribers
};

export default userSubscriptionService;
