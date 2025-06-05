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
    quantity: string;
    creatAt: string;
    campaignId: string;
    registerReceiverName: string;
    code: string;
    status: string;
    actualQuantity: number;
}

interface RegisterReceiverState {
    listRegisterReceivers: RegisterReceiver[];
}

interface UpdateActualQuantity {
    registerReceiverId: string;
    actualQuantity: number;
}