import catchAsync from "../../util/catchAsync";
import promoCodeServices from "./promoCode.service";

// promo code controller
const createPromoCode = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await promoCodeServices.createPromoCode(data);
    res.status(201).json({
        success: true,
        message: "Promo code created successfully",
        data: {
            promoCode: result
        }
    });
})

const updatePromoCode = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const result = await promoCodeServices.updatePromoCode(id, data);
    res.status(200).json({
        success: true,
        message: "Promo code updated successfully",
        data: {
            promoCode: result
        }
    });
})

const getPromoCodeById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await promoCodeServices.getPromoCodeById(id);
    res.status(200).json({
        success: true,
        message: "Promo code retrieved successfully",
        data: {
            promoCode: result
        }
    });
})

const getPromoCodes = catchAsync(async (req, res) => {
    const result = await promoCodeServices.getPromoCodes();
    res.status(200).json({
        success: true,
        message: "Promo codes retrieved successfully",
        data: {
            promoCodes: result
        }
    });
})

const deletePromoCode = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await promoCodeServices.deletePromoCode(id);
    res.status(200).json({
        success: true,
        message: "Promo code deleted successfully",
        data: {
            promoCode: result
        }
    });
})


const promoCodeController = {
    createPromoCode,
    updatePromoCode,
    getPromoCodeById,
    getPromoCodes,
    deletePromoCode
};

export default promoCodeController;