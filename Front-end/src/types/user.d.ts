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
    listDonorCertificate: DonorCertificate[];
    listRecipientCertificate: RecipientCertificate[];
}

interface PersonalDonor {
    citizenId: string;
}

interface OrganizationDonor {
    organizationName: string;
    taxIdentificationNumber: string;
}

interface AddRecipientCertificate {
    citizenId: string;
}

interface DonorCertificate {
    donorCertificateId: string;
    donorId: string;
    email: string;
    fullName: string;
    phone: string;
    organizationName?: string | null;
    taxIdentificationNumber?: string | null;
    citizenId?: string | null;
    status: string;
    rejectComment?: string | null;
}

interface RecipientCertificate {
    recipientCertificateId: string;
    recipientId: string;
    email: string;
    fullName: string;
    phone: string;
    citizenId?: string | null;
    status: string;
    rejectComment?: string | null;
}

interface ApproveCertificate {
    certificateId: string;
    type: number;
}

interface RejectCertificate {
    certificateId: string;
    type: number;
    comment: string;
}

interface ConfirmUser {
    accountId: string;
    type: string;
}