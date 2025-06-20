import type Company from "./company";

export default interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
    phoneNumber?: string;
    lastLoginAt: string;
    currentPlanId: number;
    isOnTrial: boolean;
    trialEndsAt?: string;
    avatar?: string;
    createdAt: string;
    updatedAt?: string;
    company?: Company
    isTwoFactorEnabled: boolean
};