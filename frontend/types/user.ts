export default interface User {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: 'user' | 'admin';
    phoneNumber: string | null;
    isVerified: boolean;
    lastLoginAt: string;
    currentPlanId: number;
    isOnTrial: boolean;
    trialEndsAt: string;
    avatar: string;
    createdAt: string;
    updatedAt: string | null;
};