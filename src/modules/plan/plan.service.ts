import idConverter from "../../util/idConvirter";
import { TPlan } from "./plan.interface";
import { PlanModel } from "./plan.model";

const createPlan = async (data: Partial<TPlan>) => {
    try {
        const plan = await PlanModel.create(data);
        return plan;
    } catch (error) {

        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while creating the plan");
        } else {
            throw new Error("An error occurred while creating the plan");
        }
    }
}

const updatePlan = async (id: string, data: Partial<TPlan>) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await PlanModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Plan does not exist");
        }

        const plan = await PlanModel.findByIdAndUpdate(idConvert, data, { new: false });
        return plan;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while updating the plan");
        } else {
            throw new Error("An error occurred while updating the plan");
        }
    }
}

const getPlanById = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await PlanModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Plan does not exist");
        }

        const plan = await PlanModel.findById(idConvert);
        return plan;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the plan");
        } else {
            throw new Error("An error occurred while retrieving the plan");
        }
    }
}

const getPlans = async () => {
    try {
        const plans = await PlanModel.find().populate({
            path: "services", // from Plan model
            model: "Pick",
            populate: [
                { path: "sport", model: "SportType" },
                { path: "league", model: "League" },
                { path: "teaser", model: "TeaserType" },
                { path: "teamDetails.team", model: "Team" }
            ]
        });
        return plans;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the plans");
        } else {
            throw new Error("An error occurred while retrieving the plans");
        }
    }
}

const deletePlan = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await PlanModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Plan does not exist");
        }

        const plan = await PlanModel.findByIdAndDelete(idConvert);
        return plan;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while deleting the plan");
        } else {
            throw new Error("An error occurred while deleting the plan");
        }
    }
}


const planServices = {
    createPlan,
    updatePlan,
    getPlanById,
    getPlans,
    deletePlan
};
export default planServices;
