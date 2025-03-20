interface CreateRegisterReceiver {
    registerReceiverName: string;
    quantity: number;
    creatAt: string;
    campaignId: string | undefined;
}

interface RegisterReceiver {
    registerReceiverId: string;
    accountId: string;
    fullName: string;
    email: string;
    phone: string;
    roleId: number;
    quantity: number;
    creatAt: string;
    campaignId: string;
    registerReceiverName: string;
}

interface RegisterReceiverState {
    listRegisterReceivers: RegisterReceiver[];
}