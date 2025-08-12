import idConverter from "../../util/idConvirter";
import { TPromoCode } from "./promoCode.interface";
import promoCodeModel from "./promoCode.model";


const createPromoCode = async (data: Partial<TPromoCode>) => {
    try {
        const promoCode = await promoCodeModel.create(data);
        return promoCode;
    } catch (error) {

        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while creating the plan");
        } else {
            throw new Error("An error occurred while creating the plan");
        }
    }
}

const updatePromoCode = async (id: string, data: Partial<TPromoCode>) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await promoCodeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Promo code does not exist");
        }

        const promoCode = await promoCodeModel.findByIdAndUpdate(idConvert, data, { new: false });
        return promoCode;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while updating the promo code");
        } else {
            throw new Error("An error occurred while updating the promo code");
        }
    }
}

const getPromoCodeById = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await promoCodeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Promo code does not exist");
        }

        const promoCode = await promoCodeModel.findById(idConvert);
        return promoCode;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the promo code");
        } else {
            throw new Error("An error occurred while retrieving the promo code");
        }
    }
}

const getPromoCodes = async () => {
    try {
        const promoCodes = await promoCodeModel.find();
        return promoCodes;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the promo codes");
        } else {
            throw new Error("An error occurred while retrieving the promo codes");
        }
    }
}

const deletePromoCode = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await promoCodeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Promo code does not exist");
        }

        const promoCode = await promoCodeModel.findByIdAndDelete(idConvert);
        return promoCode;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while deleting the promo code");
        } else {
            throw new Error("An error occurred while deleting the promo code");
        }
    }
}


const promoCodeServices = {
    createPromoCode,
    updatePromoCode,
    getPromoCodeById,
    getPromoCodes,
    deletePromoCode
};

export default promoCodeServices;