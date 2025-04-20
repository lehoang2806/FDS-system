interface RequestSupportActions {
    fullName: string;
    dateOfBirth: string; // ISO format date string
    phoneNumber: string;
    address: string;
    email: string;
    reason: string;
    householdSize: number;
    specialMembers: string;
    incomeSource: string;
    requestedItems: string[];
    createdDate: string; // ISO format date string
}

interface RequestSupportState {
    listRequestSupport: RequestSupport[];
    requestSupport: RequestSupport | null;
}

interface RequestSupportInfo {
    requestSupportId: string;
    campaignId: string | null;
    accountId: string;
    fullName: string;
    dateOfBirth: string; // ISO 8601 format
    phoneNumber: string;
    address: string;
    email: string;
    reason: string;
    householdSize: number;
    specialMembers: string;
    incomeSource: string;
    requestedItems: string[];
    createdDate: string; // ISO 8601 format
  }
  
