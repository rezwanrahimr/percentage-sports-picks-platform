import mongoose, { Schema } from "mongoose";
import { TLeague, TSportType, TTeaserType } from "./pick.interface";

const SportTypeSchema = new Schema<TSportType>({
    title: { type: String, required: true, unique: true }
});

const LeagueSchema = new Schema<TLeague>({
    title: { type: String, required: true, unique: true }
});

const TeaserTypeSchema = new Schema<TTeaserType>({
    title: { type: String, required: true, unique: true }
});



export const SportTypeModel = mongoose.model<TSportType>("SportType", SportTypeSchema);
export const LeagueModel = mongoose.model<TLeague>("League", LeagueSchema);
export const TeaserTypeModel = mongoose.model<TTeaserType>("TeaserType", TeaserTypeSchema);
