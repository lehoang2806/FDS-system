import { AddRecipientCertificate, ApproveCertificate, ConfirmUser, OrganizationDonor, PersonalDonor, RejectCertificate, ReviewCertificate, UserUpdate } from "@/types/user";
import request from "../request";

export const getAllUserApi = async () => {
    const data = await request.get('api/user/GetAllUser');
    return data.data;
};

export const updateUserProfileApi = async (params: UserUpdate) => {
    const data = await request.put('api/user/UpdateProfile', params);
    return data.data;
}

export const createPersonalDonorCertificateApi = async (params: PersonalDonor) => {
    const data = await request.post('api/user/CreatePersonalDonorCertificate', params);
    return data.data;
}

export const createOrganizationDonorCertificateApi = async (params: OrganizationDonor) => {
    const data = await request.post('api/user/CreateOrganizationDonorCertificate', params);
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

export const getPersonalDonorCertificateByIdApi = async (personalDonorCertificateId: string) => {
    const data = await request.get(`api/user/GetPersonalDonorCertificateById/${personalDonorCertificateId}`);
    return data.data;
}

export const getOrganizationDonorCertificateByIdApi = async (organizationDonorCertificateId: string) => {
    const data = await request.get(`api/user/GetOrganizationDonorCertificateById/${organizationDonorCertificateId}`);
    return data.data;
}

export const getRecipientCertificateByIdApi = async (recipientCertificateId: string) => {
    const data = await request.get(`api/user/GetRecipientCertificateById/${recipientCertificateId}`);
    return data.data;
}

export const additionalCertificateApi = async (params: ReviewCertificate) => {
    const data = await request.post('api/user/CommentCertificate', params);
    return data.data;
}

export const getProfileApi = async (accountId: string) => {
    const data = await request.get(`api/user/GetAccountById?accountId=${accountId}`);
    return data.data;
};

export const updatePersonalDonorCertificateApi = async (id: string, params: PersonalDonor) => {
    const data = await request.put(`api/user/UpdatePersonalDonorCertificate?id=${id}`, params);
    return data.data;
}

export const updateOrganizationDonorCertificateApi = async (id: string, params: OrganizationDonor) => {
    const data = await request.put(`api/user/UpdateOrganizationDonorCertificate?id=${id}`, params);
    return data.data;
}

export const updateRecipientCertificateApi = async (id: string, params: AddRecipientCertificate) => {
    const data = await request.put(`api/user/UpdateRecipientCertificate?id=${id}`, params);
    return data.data;
}