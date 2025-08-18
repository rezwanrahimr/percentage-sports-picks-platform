import catchAsync from "../../util/catchAsync";
import userSubscriptionService from "./userSubscription.service";

const getUserById = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const result = await userSubscriptionService.getUserById(userId);
    res.status(200).json({
        success: true,
        message: "Subscription retrieved successfully",
        data: {
            subscription: result
        }
    });
});

const getTotalSubscribers = catchAsync(async (req, res) => {
    const result = await userSubscriptionService.getTotalSubscribers();
    res.status(200).json({
        success: true,
        message: "Subscription retrieved successfully",
        data: {
            subscription: result
        }
    });
});

const getActiveSubscribers = catchAsync(async (req, res) => {
    const result = await userSubscriptionService.getActiveSubscribers();
    res.status(200).json({
        success: true,
        message: "Active subscribers retrieved successfully",
        data: {
            subscription: result
        }
    });
});

const userSubscriptionController = {
    getUserById,
    getTotalSubscribers,
    getActiveSubscribers
};

export default userSubscriptionController;