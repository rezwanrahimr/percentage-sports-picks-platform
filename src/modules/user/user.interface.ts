import { TUserRole } from "../../constents"

export type TUser = {
    name: string,
    email: string,
    role?: TUserRole,
    title?: string,
    provider?: string,
    providerId?: string,
    img?: string,
    isNotificationEnabled?: boolean,
    isLoggedIn?: boolean,
    loggedOutTime?: Date
}

