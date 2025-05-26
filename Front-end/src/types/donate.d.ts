interface Donate {
    id: string;
    donorDonateId: string;
    donorId: string;
    amount: number;
    message: string;
    transactionId: string;
    donateDate: string; // hoặc `Date` nếu bạn parse thành đối tượng Date
    createdAt: string;
    updatedAt: string;
    isPaid: boolean;
}

interface DonateState {
    donates: Donate[];
}
