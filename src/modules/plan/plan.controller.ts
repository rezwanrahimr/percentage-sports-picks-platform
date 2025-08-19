import catchAsync from "../../util/catchAsync";
import NotificationHelper from "../notifications/notification-helper.service";
import planServices from "./plan.service";

// plan.controller.ts
const createPlan = catchAsync(async (req, res) => {
    const adminId = req.user?.id;
    console.log("✅ Admin ID extracted:", adminId);
    
    if (!adminId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Admin ID missing"
        });
    }
    
    const data = req.body;
    const result = await planServices.createPlan(data);
    console.log("✅ Plan created:", result);

    if (result?._id) {
        console.log("🔔 About to call NotificationHelper.notifyNewSubscriptionPlan");
        console.log("🔔 Plan data:", { _id: result._id, name: result.name });
        console.log("🔔 Admin ID:", adminId);
        
        try {
            console.log("🔔 Calling NotificationHelper...");
            const notificationResult = await NotificationHelper.notifyNewSubscriptionPlan(result, adminId);
            console.log("✅ NotificationHelper returned:", notificationResult);
        } catch (error) {
            console.error("❌ NotificationHelper error:", error);
        }
    } else {
        console.log("⚠️ No result._id found, skipping notification");
    }

    res.status(201).json({
        success: true,
        message: "Plan created successfully",
        data: { plan: result }
    });
});

const updatePlan = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const result = await planServices.updatePlan(id, data);
    res.status(200).json({
        success: true,
        message: "Plan updated successfully",
        data: {
            plan: result
        }
    });
})

const getPlanById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await planServices.getPlanById(id);
    res.status(200).json({
        success: true,
        message: "plan retrieved successfully",
        data: {
            plan: result
        }
    });
})

const getPlans = catchAsync(async (req, res) => {
    const result = await planServices.getPlans();
    res.status(200).json({
        success: true,
        message: "Plans retrieved successfully",
        data: {
            plans: result
        }
    });
})

const deletePlan = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await planServices.deletePlan(id);
    res.status(200).json({
        success: true,
        message: "Plan deleted successfully",
        data: {
            plan: result
        }
    });
})


const planController = {
    createPlan,
    updatePlan,
    getPlanById,
    getPlans,
    deletePlan
};

export default planController;