import idConverter from "../../util/idConvirter";
import { LeagueModel, SportTypeModel } from "./pick.model"

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
    deleteLeague
}

export default pickServices;