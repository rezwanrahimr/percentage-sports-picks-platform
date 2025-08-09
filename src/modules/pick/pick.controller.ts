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


/* league */
const createLeague = catchAsync(async (req, res) => {
    const { title } = req.body;

    const result = await pickServices.createLeague(title);
    res.status(201).json({
        success: true,
        message: "League created successfully",
        data: {
            league: result
        }
    });
})

const updateLeague = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const result = await pickServices.updateLeague(id, title);
    res.status(200).json({
        success: true,
        message: "League updated successfully",
        data: {
            league: result
        }
    });
})

const getLeagueById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.getLeagueById(id);
    res.status(200).json({
        success: true,
        message: "League retrieved successfully",
        data: {
            league: result
        }
    });
})

const getLeagues = catchAsync(async (req, res) => {
    const result = await pickServices.getLeagues();
    res.status(200).json({
        success: true,
        message: "Leagues retrieved successfully",
        data: {
            leagues: result
        }
    });
})

const deleteLeague = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.deleteLeague(id);
    res.status(200).json({
        success: true,
        message: "League deleted successfully",
        data: {
            league: result
        }
    });
})

const pickController = {
    createSportType,
    updateSportType,
    getSportTypeById,
    getSportTypes,
    deleteSportType,
    createLeague,
    updateLeague,
    getLeagueById,
    getLeagues,
    deleteLeague
}

export default pickController;