export interface UpdateSubscriptionStatusParams {
    userId: string;
    subscriptionId?: string;
    status: 'active' | 'inactive' | 'cancelled' | 'pending' | 'trialing';
}

// export interface SubscriptionStatusResponse {
//     subscriptionId: string;
//     previousStatus: string;
//     currentStatus: string;
//     updatedAt: Date;
//     subscription: {
//         id: string;
//         userId: string;
//         planId: string;
//         status: string;
//         startDate: Date | null;
//         endDate: Date | null;
//         type: string;
//     };
// }