export type UserUpdate = {
    email?: string;
    fullName?: string;
    address?: string;
    birthDay?: string;
    phone?: string;
    gender?: string;
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