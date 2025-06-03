export type UserUpdate = {
    fullName?: string;
    address?: string;
    birthDay?: string;
    avatar?: string,
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
    userCreated?: string | null;
    dateCreated?: string | null;
    userUpdated?: string | null;
    dateUpdated?: string | null;
    isDelete?: boolean | null;
    userDelete?: string | null;
    dateDelete?: string | null;
    roleId: number;
    address?: string | null;
    isConfirm: boolean;
    type?: string | null;
    donorType?: string | null;
    createdDate: string;
    isBanned: boolean;
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
    profileUser: UserInfo | null;
    listDonorCertificate: DonorCertificate[];
    listRecipientCertificate: RecipientCertificate[];
    currentDonorPersonalCertificate: currentPersonalDonorCertificate | null;
    currentDonorOrganizationCertificate: currentOrganizationDonorCertificate | null;
    currentRecipientCertificate: currentRecipientCertificate | null;
}

interface PersonalDonor {
    fullName: string;
    birthDay: string;
    email: string;
    phone: string;
    address: string;
    socialMediaLink: string;
    mainSourceIncome: string;
    monthlyIncome: string;
    citizenImages: string[];
    otherImages: string[];
}

interface OrganizationDonor {
    organizationName: string;
    taxIdentificationNumber: string;
    organizationAbbreviatedName: string;
    organizationType: string;
    mainBusiness: string;
    organizationAddress: string;
    contactPhone: string;
    organizationEmail: string;
    websiteLink: string;
    representativeName: string;
    representativePhone: string;
    representativeEmail: string;
    images: string[];
}

interface AddRecipientCertificate {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    birthDay: string;
    circumstances: string;
    registerSupportReason: string;
    mainSourceIncome: string;
    monthlyIncome: string;
    citizenImages: string[];
    otherImages: string[];
}

interface DonorCertificate {
    donorCertificateId: string;
    donorId: string;
    citizenId: string | null;
    status: string;
    rejectComment: string | null;
    createdDate: string;
    fullName: string | null;
    birthDay: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    socialMediaLink: string | null;
    mainSourceIncome: string | null;
    monthlyIncome: string | null;
    images: string[];
    organizationName: string;
    taxIdentificationNumber: string;
    organizationAbbreviatedName: string;
    organizationType: string;
    mainBusiness: string;
    organizationAddress: string;
    contactPhone: string;
    organizationEmail: string;
    websiteLink: string;
    representativeName: string;
    representativePhone: string;
    representativeEmail: string;
    reviewComments: string[] | null;
}

interface RecipientCertificate {
    recipientCertificateId: string;
    recipientId: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    birthDay: string;
    circumstances: string;
    registerSupportReason: string;
    mainSourceIncome: string;
    monthlyIncome: string;
    citizenImages: string[];
    otherImages: string[];    
    status: string;
    rejectComment?: string | null;
    createdDate: string;
    reviewComments?: string[] | null;
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

interface ReviewCertificate {
    certificateId: string;
    type: number;
    content: string;
}

interface ConfirmUser {
    accountId: string;
    type: string;
}

interface currentPersonalDonorCertificate {
    id: string;
    donorId: string;
    personalDonorCertificateId: string;
    status: string;
    rejectComment?: string | null;
    createdDate: string;
    fullName: string;
    birthDay: string;
    email: string;
    phone: string;
    address: string;
    socialMediaLink?: string;
    mainSourceIncome: string;
    monthlyIncome: string;
    citizenImages: string[];
    otherImages: string[];
    reviewComments?: ReviewComment[] | null;
}

interface currentOrganizationDonorCertificate {
    id: string;
    donorId: string;
    organizationDonorCertificateId: string;
    organizationName: string;
    taxIdentificationNumber: string;
    status: string;
    rejectComment?: string | null;
    organizationAbbreviatedName: string;
    organizationType: string;
    mainBusiness: string;
    organizationAddress: string;
    contactPhone: string;
    organizationEmail: string;
    websiteLink: string;
    representativeName: string;
    representativePhone: string;
    representativeEmail: string;
    createdDate: string;
    images: string[];
    reviewComments?: ReviewComment[] | null;
}

interface currentRecipientCertificate {
    id: string;
    recipientId: string;
    recipientCertificateId: string;
    status: string;
    rejectComment?: string | null;
    campaignId?: string | null;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    birthDay: string;
    circumstances: string;
    registerSupportReason: string;
    mainSourceIncome: string;
    monthlyIncome: string;
    citizenImages: string[];
    otherImages: string[];    
    createdDate: string;
    reviewComments?: ReviewComment[] | null;
}

interface BanAccountParams {
    accountId: string;
    reason: string;
}

interface UnBanAccountParams {
    accountId: string;
}
