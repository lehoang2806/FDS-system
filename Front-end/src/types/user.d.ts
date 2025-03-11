export type UserUpdate = {
    email?: string;
    fullName?: string;
    address?: string;
    birthDay?: string;
    phone?: string;
    gender?: string;
};

export type UserInfo = {
    id: string;
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
};

interface AddStaff {
    fullName: string;
    phone: string;
    password: string;
    userEmail: string;
}

interface AdminStaffState {
    message: string;
}

interface UserState {
    listUser: UserInfo[];
}