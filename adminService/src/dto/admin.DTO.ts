export interface registerSuperAdmin {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    phoneNumber: string;
    isEmailVerified?: boolean;
    isAdminDeleted?: boolean;
}

export interface loginSuperAdminDTO {
    email: string;
    password: string;
    role: string
}