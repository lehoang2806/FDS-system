interface NewsState {
    listNews: NewsInfo[];
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
    createDate: string;
    images: string[];
    newsDescripttion: string;
    supportBeneficiaries: string;
}