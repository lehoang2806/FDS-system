interface RequestSupportActions {
    fullName: string;
    dateOfBirth: string; // ISO date string (e.g., "2025-04-29T02:59:04.069Z")
    citizenId: string;
    citizenIdImages: string[];
    phoneNumber: string;
    address: string;
    email: string;
    localAuthorityContact: string;
    relativeContact: string;
    reason: string;
    householdSize: number;
    specialMembers: string;
    circumstanceImages: string[];
    localAuthorityConfirmation: string;
    incomeSource: string;
    monthlyIncome: number;
    requestedItems: string[];
    createdDate: string; // ISO date string
    images: string[];
    hasReceivedSupportBefore: boolean;
    previousSupportDetails: string;
    commitmentToAccuracy: boolean;
    signatureImage: string;
}

interface RequestSupportState {
    listRequestSupport: RequestSupport[];
    requestSupport: RequestSupport | null;
    listDonorSupport: DonorSupport[];
}

interface RequestSupportInfo {
    accountId: string;
    address: string;
    campaignId: string | null;
    circumstanceImages: string[]; // Mảng base64 của hình ảnh
    citizenId: string;
    citizenIdImages: string[]; // Mảng base64 của hình ảnh chứng minh nhân dân
    commitmentToAccuracy: boolean;
    createdDate: string;
    dateOfBirth: string;
    email: string;
    fullName: string;
    hasReceivedSupportBefore: boolean;
    householdSize: number;
    images: string[]; // Mảng base64 của hình ảnh
    incomeSource: string;
    localAuthorityConfirmation: string;
    localAuthorityContact: string;
    monthlyIncome: number;
    phoneNumber: string;
    previousSupportDetails: string;
    reason: string;
    relativeContact: string;
    requestSupportId: string;
    requestedItems: string[]; // Mảng các phần quà yêu cầu
    signatureImage: string; // Base64 của chữ ký
    specialMembers: string;
    supportDonors: DonorSupport[] | null; // Mảng các nhà tài trợ hỗ trợ
}

interface RequestDonor {
    requestSupportId: string;
    emails: string[];
}

interface DonorSupport {
    donorId: string;
    email: string;
    fullName: string;
    donorType: string;
    status: string;
}

