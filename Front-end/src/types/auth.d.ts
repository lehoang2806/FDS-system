export type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    userInfo: UserProfile | null;
};

interface ILoginEmail {
    userEmail: string;
    password: string;
}

export type AuthResponse = {
    userInfo: UserProfile;
    token: string;
};

export type UserProfile = {
    _id: string;
    AccountId: string;
    Email: string;
    Password: string;
    CreateDate: string;
    FullName: string;
    BirthDay?: string | null;
    Phone: string;
    Avatar?: string | null;
    Gender?: string | null;
    Status?: string | null;
    UserCreated?: string | null;
    DateCreated?: string | null;
    UserUpdated?: string | null;
    DateUpdated?: string | null;
    IsDelete?: boolean | null;
    UserDelete?: string | null;
    DateDelete?: string | null;
    RoleId: number;
    Address?: string | null;
};
