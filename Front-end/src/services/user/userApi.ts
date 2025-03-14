import { AddRecipientCertificate, ApproveCertificate, ConfirmUser, PersonalDonor, RejectCertificate } from "@/types/user";
import request from "../request";

export const getAllUserApi = async () => {
    const data = await request.get('api/user/GetAllUser');
    return data.data;
};

export const createPersonalDonorCertificateApi = async (params: PersonalDonor) => {
    const data = await request.post('api/user/CreatePersonalDonorCertificate', params);
    return data.data;
}

export const getAllDonorCertificateApi = async () => {
    const data = await request.get('api/user/getAllDonorCertificate');
    return data.data;
}

export const approveCertificateApi = async (params: ApproveCertificate) => {
    const data = await request.put('api/user/ApproveCertificate', params);
    return data.data;
}

export const rejectCertificateApi = async (params: RejectCertificate) => {
    const data = await request.put('api/user/RejectCertificate', params);
    return data.data;
}

export const confirmUserApi = async (params: ConfirmUser) => {
    const data = await request.put('api/user/Confirm', params);
    return data.data;
}

export const createRecipientCertificateApi = async (params: AddRecipientCertificate) => {
    const data = await request.post('api/user/CreateRecipientCertificate', params);
    return data.data;
}

export const getAllRecipientCertificateApi = async () => {
    const data = await request.get('api/user/getAllRecipientCertificate');
    return data.data;
}