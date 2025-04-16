export type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    userInfo: UserProfile | null;
};

interface ILoginEmail {
    userEmail: string;
    password: string;
}

interface IRegisterEmail {
    fullName: string;
    userEmail: string;
    password: string;
    phone: string;
    roleId: number;
}

interface IForgetPassword {
    email: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type AuthResponse = {
    userInfo: UserProfile;
    token: string;
};

export type TextResponse = {
    message: string;
}

export type UserProfile = {
    _id: string;
    accountId: string;
    email: string;
    password: string;
    createDate: string;
    fullName: string;
    birthDay?: string | null;
    phone: string;
    avatar?: string | null;
    gender?: string | null;
    status?: string | null;
    userCreated?: string | null;
    dateCreated?: string | null;
    userUpdated?: string | null;
    dateUpdated?: string | null;
    isDelete?: boolean | null;
    userDelete?: string | null;
    dateDelete?: string | null;
    roleId: number;
    address?: string | null;
    isConfirm?: boolean | null;
    type?: string | null;
};
