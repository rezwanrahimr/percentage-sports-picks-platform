import catchAsync from "../../util/catchAsync";
import pickServices from "./pick.service";

/* sport type */
const createSportType = catchAsync(async (req, res) => {
    const { title } = req.body;

    const result = await pickServices.createSportType(title);
    res.status(201).json({
        success: true,
        message: "Sport type created successfully",
        data: {
            sportType: result
        }
    });
})

const updateSportType = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const result = await pickServices.updateSportType(id, title);
    res.status(200).json({
        success: true,
        message: "Sport type updated successfully",
        data: {
            sportType: result
        }
    });
})

const getSportTypeById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.getSportTypeById(id);
    res.status(200).json({
        success: true,
        message: "Sport type retrieved successfully",
        data: {
            sportType: result
        }
    });
})

const getSportTypes = catchAsync(async (req, res) => {
    const result = await pickServices.getSportTypes();
    res.status(200).json({
        success: true,
        message: "Sport types retrieved successfully",
        data: {
            sportType: result
        }
    });
})

const deleteSportType = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.deleteSportType(id);
    res.status(200).json({
        success: true,
        message: "Sport type deleted successfully",
        data: {
            sportType: result
        }
    });
})


const pickController = {
    createSportType,
    updateSportType,
    getSportTypeById,
    getSportTypes,
    deleteSportType
}

export default pickController;