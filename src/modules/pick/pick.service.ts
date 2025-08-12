import idConverter from "../../util/idConvirter";
import { uploadToCloudinary } from "../../util/uploadImgToCloudinary";
import { LeagueModel, PickModel, SportTypeModel, TeamModel, TeaserTypeModel } from "./pick.model"

/* sport type */
const createSportType = async (title: string) => {
    try {
        const isExist = await SportTypeModel.findOne({ title });
        if (isExist) {
            throw new Error("Sport type already exists");
        }

        const sportType = await SportTypeModel.create({ title });
        return sportType;
    } catch (error) {

        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while creating the sport type");
        } else {
            throw new Error("An error occurred while creating the sport type");
        }
    }
}

const updateSportType = async (id: string, title: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await SportTypeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Sport type does not exist");
        }

        const sportType = await SportTypeModel.findByIdAndUpdate(idConvert, { title }, { new: false });
        return sportType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while updating the sport type");
        } else {
            throw new Error("An error occurred while updating the sport type");
        }
    }
}

const getSportTypeById = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await SportTypeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Sport type does not exist");
        }

        const sportType = await SportTypeModel.findById(idConvert);
        return sportType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the sport type");
        } else {
            throw new Error("An error occurred while retrieving the sport type");
        }
    }
}

const getSportTypes = async () => {
    try {
        const sportTypes = await SportTypeModel.find();
        return sportTypes;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the sport types");
        } else {
            throw new Error("An error occurred while retrieving the sport types");
        }
    }
}

const deleteSportType = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await SportTypeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Sport type does not exist");
        }

        const sportType = await SportTypeModel.findByIdAndDelete(idConvert);
        return sportType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while deleting the sport type");
        } else {
            throw new Error("An error occurred while deleting the sport type");
        }
    }
}


/* league */
const createLeague = async (title: string) => {
    try {
        const isExist = await LeagueModel.findOne({ title });
        if (isExist) {
            throw new Error("League already exists");
        }

        const league = await LeagueModel.create({ title });
        return league;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while creating the league");
        } else {
            throw new Error("An error occurred while creating the league");
        }
    }
}

const updateLeague = async (id: string, title: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await LeagueModel.findById(idConvert);
        if (!isExist) {
            throw new Error("League does not exist");
        }

        const league = await LeagueModel.findByIdAndUpdate(idConvert, { title }, { new: false });
        return league;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while updating the league");
        } else {
            throw new Error("An error occurred while updating the league");
        }
    }
}

const getLeagueById = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await LeagueModel.findById(idConvert);
        if (!isExist) {
            throw new Error("League does not exist");
        }

        const league = await LeagueModel.findById(idConvert);
        return league;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the league");
        } else {
            throw new Error("An error occurred while retrieving the league");
        }
    }
}

const getLeagues = async () => {
    try {
        const leagues = await LeagueModel.find();
        return leagues;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the leagues");
        } else {
            throw new Error("An error occurred while retrieving the leagues");
        }
    }
}

const deleteLeague = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await LeagueModel.findById(idConvert);
        if (!isExist) {
            throw new Error("League does not exist");
        }

        const league = await LeagueModel.findByIdAndDelete(idConvert);
        return league;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while deleting the league");
        } else {
            throw new Error("An error occurred while deleting the league");
        }
    }
}


/* teaser types */
const createTeaserType = async (title: string) => {
    try {
        const isExist = await TeaserTypeModel.findOne({ title });
        if (isExist) {
            throw new Error("Teaser type already exists");
        }

        const teaserType = await TeaserTypeModel.create({ title });
        return teaserType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while creating the teaser type");
        } else {
            throw new Error("An error occurred while creating the teaser type");
        }
    }
}

const updateTeaserType = async (id: string, title: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await TeaserTypeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Teaser type does not exist");
        }

        const teaserType = await TeaserTypeModel.findByIdAndUpdate(idConvert, { title }, { new: false });
        return teaserType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while updating the teaser type");
        } else {
            throw new Error("An error occurred while updating the teaser type");
        }
    }
}

const getTeaserTypeById = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await TeaserTypeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Teaser type does not exist");
        }

        const teaserType = await TeaserTypeModel.findById(idConvert);
        return teaserType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the teaser type");
        } else {
            throw new Error("An error occurred while retrieving the teaser type");
        }
    }
}

const getTeaserTypes = async () => {
    try {
        const teaserTypes = await TeaserTypeModel.find();
        return teaserTypes;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the teaser types");
        } else {
            throw new Error("An error occurred while retrieving the teaser types");
        }
    }
}

const deleteTeaserType = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await TeaserTypeModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Teaser type does not exist");
        }

        const teaserType = await TeaserTypeModel.findByIdAndDelete(idConvert);
        return teaserType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while deleting the teaser type");
        } else {
            throw new Error("An error occurred while deleting the teaser type");
        }
    }
}



/* team */

const createTeam = async (name: string, image: Express.Multer.File) => {
    try {
        const isExist = await TeamModel.findOne({ name });
        if (isExist) {
            throw new Error("Team already exists");
        }
        const result = await uploadToCloudinary(image.path, 'profile/images');
        const team = await TeamModel.create({ name, image: result });
        return team;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while creating the team");
        } else {
            throw new Error("An error occurred while creating the team");
        }
    }
}

const updateTeam = async (id: string, name: string, image: Express.Multer.File) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await TeamModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Team does not exist");
        }

        if (image) {
            const result = await uploadToCloudinary(image.path, 'profile/images');
            const team = await TeamModel.findByIdAndUpdate(idConvert, { name, image: result }, { new: false });
            return team;
        } else {
            const team = await TeamModel.findByIdAndUpdate(idConvert, { name }, { new: false });
            return team;
        }

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while updating the team");
        } else {
            throw new Error("An error occurred while updating the team");
        }
    }
}

const getTeamById = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await TeamModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Team does not exist");
        }

        const team = await TeamModel.findById(idConvert);
        return team;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the team");
        } else {
            throw new Error("An error occurred while retrieving the team");
        }
    }
}

const getTeams = async () => {
    try {
        const teams = await TeamModel.find();
        return teams;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the teams");
        } else {
            throw new Error("An error occurred while retrieving the teams");
        }
    }
}

const deleteTeam = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await TeamModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Team does not exist");
        }

        const team = await TeamModel.findByIdAndDelete(idConvert);
        return team;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while deleting the team");
        } else {
            throw new Error("An error occurred while deleting the team");
        }
    }
}



/* pick */

const createPick = async (sport: string, league: string, teaser: string, teamDetails: string, riskingAmount: number, toWinAmount: number) => {
    try {
        const pick = await PickModel.create({ sport, league, teaser, teamDetails, riskingAmount, toWinAmount });
        return pick;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while creating the pick");
        } else {
            throw new Error("An error occurred while creating the pick");
        }
    }
}

const updatePick = async (id: string, sport: string, league: string, teaser: string, teamDetails: string, riskingAmount: number, toWinAmount: number) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await PickModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Pick does not exist");
        }

        const pick = await PickModel.findByIdAndUpdate(idConvert, { sport, league, teaser, teamDetails, riskingAmount, toWinAmount }, { new: false });
        return pick;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while updating the pick");
        } else {
            throw new Error("An error occurred while updating the pick");
        }
    }
}

const getPickById = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await PickModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Pick does not exist");
        }

        const pick = await PickModel.findById(idConvert).populate("sport league teaser teamDetails.team");
        return pick;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the pick");
        } else {
            throw new Error("An error occurred while retrieving the pick");
        }
    }
}

const getPicks = async () => {
    try {
        const picks = await PickModel.find().populate("sport league teaser teamDetails.team");
        return picks;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while retrieving the picks");
        } else {
            throw new Error("An error occurred while retrieving the picks");
        }
    }
}

const deletePick = async (id: string) => {
    try {
        const idConvert = idConverter(id);
        const isExist = await PickModel.findById(idConvert);
        if (!isExist) {
            throw new Error("Pick does not exist");
        }

        const pick = await PickModel.findByIdAndDelete(idConvert);
        return pick;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "An error occurred while deleting the pick");
        } else {
            throw new Error("An error occurred while deleting the pick");
        }
    }
}

const pickServices = {
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
    deletePick
}

export default pickServices;