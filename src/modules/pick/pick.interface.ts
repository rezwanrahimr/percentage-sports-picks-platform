export type TSportType = {
    title: string;
}

export type TLeague = {
    title: string;
}

export type TTeaserType = {
    title: string;
}

export type TTeam = {
    name: string;
    image: string;
}

export type TPick = {
    sport: TSportType;
    league: TLeague;
    teaser: TTeaserType;
    teamDetails: [{
        team: TTeam;
        date: Date;
        time: Date;
        point: number;
    }];
    riskingAmount: number;
    toWinAmount: number;
}