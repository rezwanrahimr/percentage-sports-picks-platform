import idConverter from "../../util/idConvirter";
import { SportTypeModel } from "./pick.model"

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


const pickServices = {
    createSportType,
    updateSportType,
    getSportTypeById,
    getSportTypes,
    deleteSportType
}

export default pickServices;