import mongoose, { Schema } from "mongoose";
import { TLeague, TSportType, TTeam, TTeaserType } from "./pick.interface";

const SportTypeSchema = new Schema<TSportType>({
    title: { type: String, required: true, unique: true }
});

const LeagueSchema = new Schema<TLeague>({
    title: { type: String, required: true, unique: true }
});

const TeaserTypeSchema = new Schema<TTeaserType>({
    title: { type: String, required: true, unique: true }
});

const TeamSchema = new Schema<TTeam>({
    name: { type: String, required: true, unique: true },
    image: { type: String }
});



export const SportTypeModel = mongoose.model<TSportType>("SportType", SportTypeSchema);
export const LeagueModel = mongoose.model<TLeague>("League", LeagueSchema);
export const TeaserTypeModel = mongoose.model<TTeaserType>("TeaserType", TeaserTypeSchema);
export const TeamModel = mongoose.model<TTeam>("Team", TeamSchema);
