import catchAsync from "../../util/catchAsync";
import NotificationHelper from "../notifications/notification-helper.service";
import pickServices from "./pick.service";

/* sport type */
const createSportType = catchAsync(async (req, res) => {
    const { title } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Admin ID missing"
        });
    }

    const result = await pickServices.createSportType(title);

    // send notification
    if (result?._id && typeof adminId === "string") {
        try {
            const notificationResult = await NotificationHelper.notifySystemAnnouncement(
                `New Sport Type Created`,
                `A new sport type has been created: ${result.title}`,
                adminId
            );
        } catch (error) {
            console.error("❌ NotificationHelper error:", error);
        }
    } else {
        console.log("⚠️ No result._id found or adminId is not a string, skipping notification");
    }

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
    const adminId = req.user?.id;

    if (!adminId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Admin ID missing"
        });
    }

    const result = await pickServices.createLeague(title);

    // send notification
    if (result?._id && typeof adminId === "string") {
        try {
            const notificationResult = await NotificationHelper.notifySystemAnnouncement(
                `New League Created`,
                `A new league has been created: ${result.title}`,
                adminId
            );
        } catch (error) {
            console.error("❌ NotificationHelper error:", error);
        }
    } else {
        console.log("⚠️ No result._id found or adminId is not a string, skipping notification");
    }


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
    const adminId = req.user?.id;

    if (!adminId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Admin ID missing"
        });
    }

    const result = await pickServices.createTeaserType(title);

    // send notification
    if (result?._id && typeof adminId === "string") {
        try {
            const notificationResult = await NotificationHelper.notifySystemAnnouncement(
                `New Teaser Type Created`,
                `A new teaser type has been created: ${result.title}`,
                adminId
            );
        } catch (error) {
            console.error("❌ NotificationHelper error:", error);
        }
    } else {
        console.log("⚠️ No result._id found or adminId is not a string, skipping notification");
    }

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
    const adminId = req.user?.id;

    const imgFile = req.files && (req.files as any).images
        ? (req.files as any).images[0]
        : null;

    const result = await pickServices.createTeam(name, imgFile);

    // send notification
    if (result?._id && typeof adminId === "string") {
        try {
            const notificationResult = await NotificationHelper.notifySystemAnnouncement(
                `New Team Created`,
                `A new team has been created: ${result.name}`,
                adminId
            );

            res.status(201).json({
                success: true,
                message: "Team created successfully",
                data: {
                    team: result
                }
            });
        } catch (error) {
            console.error("❌ NotificationHelper error:", error);

            res.status(201).json({
                success: true,
                message: "Team created successfully, but notification failed",
                data: {
                    team: result
                }
            });
        }
    } else {
        console.log("⚠️ No result._id found or adminId is not a string, skipping notification");

        res.status(201).json({
            success: true,
            message: "Team created successfully",
            data: {
                team: result
            }
        });
    }



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


/* pick */
const createPick = catchAsync(async (req, res) => {
    const { sport, league, teaser, teamDetails, riskingAmount, toWinAmount } = req.body;

    const result = await pickServices.createPick(sport, league, teaser, teamDetails, riskingAmount, toWinAmount);
    res.status(201).json({
        success: true,
        message: "Pick created successfully",
        data: {
            pick: result
        }
    });
})

const updatePick = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { sport, league, teaser, teamDetails, riskingAmount, toWinAmount } = req.body;

    const result = await pickServices.updatePick(id, sport, league, teaser, teamDetails, riskingAmount, toWinAmount);
    res.status(200).json({
        success: true,
        message: "Pick updated successfully",
        data: {
            pick: result
        }
    });
})

const getPickById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.getPickById(id);
    res.status(200).json({
        success: true,
        message: "Pick retrieved successfully",
        data: {
            pick: result
        }
    });
})

const getPicks = catchAsync(async (req, res) => {
    const result = await pickServices.getPicks();
    res.status(200).json({
        success: true,
        message: "Picks retrieved successfully",
        data: {
            picks: result
        }
    });
})


const getPicksCount = catchAsync(async (req, res) => {
    const result = await pickServices.getPicksCount();
    res.status(200).json({
        success: true,
        message: "Picks count retrieved successfully",
        data: {
            count: result
        }
    });
})

const deletePick = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await pickServices.deletePick(id);
    res.status(200).json({
        success: true,
        message: "Pick deleted successfully",
        data: {
            pick: result
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
    deleteTeam,
    createPick,
    updatePick,
    getPickById,
    getPicks,
    getPicksCount,
    deletePick
}

export default pickController;