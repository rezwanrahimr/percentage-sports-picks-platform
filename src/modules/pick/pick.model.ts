import mongoose, { Schema } from "mongoose";
import { TLeague, TPick, TSportType, TTeam, TTeaserType } from "./pick.interface";

const SportTypeSchema = new Schema<TSportType>({
    title: { type: String, required: true, }
});

const LeagueSchema = new Schema<TLeague>({
    title: { type: String, required: true, unique: true, default: "Unknown" }
});


const TeaserTypeSchema = new Schema<TTeaserType>({
    title: { type: String, required: true, }
});

const TeamSchema = new Schema<TTeam>({
    name: { type: String, required: true},
    image: { type: String }
});


const PickSchema = new Schema<TPick>({
    sport: { type: Schema.Types.ObjectId, ref: "SportType", required: true },
    league: { type: Schema.Types.ObjectId, ref: "League", required: true },
    teaser: { type: Schema.Types.ObjectId, ref: "TeaserType", required: true },
    teamDetails: [{
        team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
        date: { type: Date, required: true },
        time: { type: Date, required: true },
        point: { type: Number, required: true }
    }],
    riskingAmount: { type: Number, required: true },
    toWinAmount: { type: Number, required: true }
});


export const SportTypeModel = mongoose.model<TSportType>("SportType", SportTypeSchema);
export const LeagueModel = mongoose.model<TLeague>("League", LeagueSchema);
export const TeaserTypeModel = mongoose.model<TTeaserType>("TeaserType", TeaserTypeSchema);
export const TeamModel = mongoose.model<TTeam>("Team", TeamSchema);
export const PickModel = mongoose.model<TPick>("Pick", PickSchema);
