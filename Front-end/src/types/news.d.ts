interface NewsState {
    listNews: NewsInfo[];
    currentNews: NewsInfo | null;
}

interface ActionParamNews {
    newsTitle: string;
    newsDescripttion: string;
    supportBeneficiaries: string;
    images: string[];  
}

interface NewsInfo {
    id: string;
    newId: string;
    newsTitle: string;
    createdDate: string;
    images: string[];
    newsDescripttion: string;
    supportBeneficiaries: string;
}

interface ActionParamNewsComment {
    newId?: string;
    content?: string;
    fileComment: string;
}