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


/* teaser types */
const createTeaserType = catchAsync(async (req, res) => {
    const { title } = req.body;

    const result = await pickServices.createTeaserType(title);
    res.status(201).json({
        success: true,
        message: "Teaser type created successfully",
        data: {
            teaserType: result
        }
    });
})

const updateTeaserType = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const result = await pickServices.updateTeaserType(id, title);
    res.status(200).json({
        success: true,
        message: "Teaser type updated successfully",
        data: {
            teaserType: result
        }
    });
})

const getTeaserTypeById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.getTeaserTypeById(id);
    res.status(200).json({
        success: true,
        message: "Teaser type retrieved successfully",
        data: {
            teaserType: result
        }
    });
})

const getTeaserTypes = catchAsync(async (req, res) => {
    const result = await pickServices.getTeaserTypes();
    res.status(200).json({
        success: true,
        message: "Teaser types retrieved successfully",
        data: {
            teaserTypes: result
        }
    });
})

const deleteTeaserType = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.deleteTeaserType(id);
    res.status(200).json({
        success: true,
        message: "Teaser type deleted successfully",
        data: {
            teaserType: result
        }
    });
})



/* team */
const createTeam = catchAsync(async (req, res) => {
    const { name } = req.body;
    const imgFile = req.files && (req.files as any).images
        ? (req.files as any).images[0]
        : null;

    const result = await pickServices.createTeam(name, imgFile);
    res.status(201).json({
        success: true,
        message: "Team created successfully",
        data: {
            team: result
        }
    });
})

const updateTeam = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const imgFile = req.files && (req.files as any).images
        ? (req.files as any).images[0]
        : null;

    const result = await pickServices.updateTeam(id, name, imgFile);
    res.status(200).json({
        success: true,
        message: "Team updated successfully",
        data: {
            team: result
        }
    });
})

const getTeamById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.getTeamById(id);
    res.status(200).json({
        success: true,
        message: "Team retrieved successfully",
        data: {
            team: result
        }
    });
})

const getTeams = catchAsync(async (req, res) => {
    const result = await pickServices.getTeams();
    res.status(200).json({
        success: true,
        message: "Teams retrieved successfully",
        data: {
            teams: result
        }
    });
})

const deleteTeam = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.deleteTeam(id);
    res.status(200).json({
        success: true,
        message: "Team deleted successfully",
        data: {
            team: result
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
    deleteLeague,
    createTeaserType,
    updateTeaserType,
    getTeaserTypeById,
    getTeaserTypes,
    deleteTeaserType,
    createTeam,
    updateTeam,
    getTeamById,
    getTeams,
    deleteTeam
}

export default pickController;