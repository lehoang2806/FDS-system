interface RequestSupportActions {
    fullName: string;
    dateOfBirth: string; // ISO date string (e.g., "2025-04-29T02:59:04.069Z")
    citizenIdImages: string[];
    phoneNumber: string;
    address: string;
    email: string;
    reason: string;
    householdSize: number;
    specialMembers: string[];
    circumstanceImages: string[];
    requestedItems: string[];
    desiredQuantity: number;
}

interface RequestSupportState {
    listRequestSupport: RequestSupport[];
    requestSupport: RequestSupport | null;
    listDonorSupport: DonorSupport[];
}

interface RequestSupportInfo {
    requestSupportId: string;
    accountId: string;
    address: string;
    campaignId: string | null;
    circumstanceImages: string[]; // Mảng base64 của hình ảnh
    citizenIdImages: string[]; // Mảng base64 của hình ảnh chứng minh nhân dân
    createdDate: string;
    dateOfBirth: string;
    email: string;
    fullName: string;
    householdSize: number;
    phoneNumber: string;
    reason: string;
    requestSupportId: string;
    requestedItems: string[]; // Mảng các phần quà yêu cầu
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
    createdDate: string;
}

