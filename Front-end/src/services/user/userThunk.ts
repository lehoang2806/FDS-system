import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    additionalCertificateApi,
    approveCertificateApi,
    banAccountApi,
    confirmUserApi,
    createOrganizationDonorCertificateApi,
    createPersonalDonorCertificateApi,
    createRecipientCertificateApi,
    getAllDonorCertificateApi,
    getAllRecipientCertificateApi,
    getAllUserApi,
    getOrganizationDonorCertificateByIdApi,
    getPersonalDonorCertificateByIdApi,
    getProfileApi,
    getRecipientCertificateByIdApi,
    rejectCertificateApi,
    unbanAccountApi,
    updateOrganizationDonorCertificateApi,
    updatePersonalDonorCertificateApi,
    updateRecipientCertificateApi,
    updateUserProfileApi,
} from "./userApi";
import {
    AddRecipientCertificate,
    ApproveCertificate,
    BanAccountParams,
    ConfirmUser,
    currentOrganizationDonorCertificate,
    currentPersonalDonorCertificate,
    currentRecipientCertificate,
    DonorCertificate,
    OrganizationDonor,
    PersonalDonor,
    RecipientCertificate,
    RejectCertificate,
    ReviewCertificate,
    UnBanAccountParams,
    UserInfo,
    UserUpdate,
} from "@/types/user";
import { TextResponse } from "@/types/auth";
import { ResponseFromServer } from "@/types/app";

const GET_ALL_USER = "GET_ALL_USER";
const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";
const CREATE_PERSONAL_DONOR_CERTIFICATE = "CREATE_PERSONAL_DONOR_CERTIFICATE";
const CREATE_ORGANIZATION_DONOR_CERTIFICATE =
    "CREATE_ORGANIZATION_DONOR_CERTIFICATE";
const GET_ALL_DONOR_CERTIFICATE = "GET_ALL_DONOR_CERTIFICATE";
const APPROVE_CERTIFICATE = "APPROVE_CERTIFICATE";
const REJECT_CERTIFICATE = "REJECT_CERTIFICATE";
const CONFIRM_USER = "CONFIRM_USER";
const CREATE_RECIPIENT_CERTIFICATE = "CREATE_RECIPIENT_CERTIFICATE";
const GET_ALL_RECIPIENT_CERTIFICATE = "GET_ALL_RECIPIENT_CERTIFICATE";
const GET_PERSONAL_DONOR_CERTIFICATE_BY_ID =
    "GET_PERSONAL_DONOR_CERTIFICATE_BY_ID";
const GET_ORGANIZATION_DONOR_CERTIFICATE_BY_ID =
    "GET_ORGANIZATION_DONOR_CERTIFICATE_BY_ID";
const GET_RECIPIENT_CERTIFICATE_BY_ID = "GET_RECIPIENT_CERTIFICATE_BY_ID";
const COMMENT_CERTIFICATE = "COMMENT_CERTIFICATE";
const GET_PROFILE = "GET_PROFILE";
const UPDATE_PERSONAL_DONOR_CERTIFICATE = "UPDATE_PERSONAL_DONOR_CERTIFICATE";
const UPDATE_ORGANIZATION_DONOR_CERTIFICATE =
    "UPDATE_ORGANIZATION_DONOR_CERTIFICATE";
const UPDATE_RECIPIENT_CERTIFICATE = "UPDATE_RECIPIENT_CERTIFICATE";
const BAN_ACCOUNT = "BAN_ACCOUNT";
const UNBAN_ACCOUNT = "UNBAN_ACCOUNT";

export const getAllUserApiThunk = createAsyncThunk<UserInfo[]>(
    GET_ALL_USER,
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllUserApi();
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const createPersonalDonorCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    PersonalDonor
>(CREATE_PERSONAL_DONOR_CERTIFICATE, async (payload, { rejectWithValue }) => {
    try {
        const response = await createPersonalDonorCertificateApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const createOrganizationDonorCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    OrganizationDonor
>(
    CREATE_ORGANIZATION_DONOR_CERTIFICATE,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await createOrganizationDonorCertificateApi(
                payload
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const updateUserProfileApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    UserUpdate
>(UPDATE_USER_PROFILE, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateUserProfileApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllDonorCertificateApiThunk = createAsyncThunk<
    DonorCertificate[]
>(GET_ALL_DONOR_CERTIFICATE, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllDonorCertificateApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const approveCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    ApproveCertificate
>(APPROVE_CERTIFICATE, async (payload, { rejectWithValue }) => {
    try {
        const response = await approveCertificateApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const rejectCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    RejectCertificate
>(REJECT_CERTIFICATE, async (payload, { rejectWithValue }) => {
    try {
        const response = await rejectCertificateApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const confirmUserApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    ConfirmUser
>(CONFIRM_USER, async (payload, { rejectWithValue }) => {
    try {
        const response = await confirmUserApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const createRecipientCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    AddRecipientCertificate
>(CREATE_RECIPIENT_CERTIFICATE, async (payload, { rejectWithValue }) => {
    try {
        const response = await createRecipientCertificateApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getAllRecipientCertificateApiThunk = createAsyncThunk<
    RecipientCertificate[]
>(GET_ALL_RECIPIENT_CERTIFICATE, async (_, { rejectWithValue }) => {
    try {
        const response = await getAllRecipientCertificateApi();
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getPersonalDonorCertificateByIdApiThunk = createAsyncThunk<
    currentPersonalDonorCertificate,
    string
>(
    GET_PERSONAL_DONOR_CERTIFICATE_BY_ID,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getPersonalDonorCertificateByIdApi(payload);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const getOrganizationDonorCertificateByIdApiThunk = createAsyncThunk<
    currentOrganizationDonorCertificate,
    string
>(
    GET_ORGANIZATION_DONOR_CERTIFICATE_BY_ID,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await getOrganizationDonorCertificateByIdApi(
                payload
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const getRecipientCertificateByIdApiThunk = createAsyncThunk<
    currentRecipientCertificate,
    string
>(GET_RECIPIENT_CERTIFICATE_BY_ID, async (payload, { rejectWithValue }) => {
    try {
        const response = await getRecipientCertificateByIdApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const additionalCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    ReviewCertificate
>(COMMENT_CERTIFICATE, async (payload, { rejectWithValue }) => {
    try {
        const response = await additionalCertificateApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const getProfileApiThunk = createAsyncThunk<UserInfo, string>(
    GET_PROFILE,
    async (accountId, { rejectWithValue }) => {
        try {
            const response = await getProfileApi(accountId);
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response?.data,
            });
        }
    }
);

export const updatePersonalDonorCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    { params: PersonalDonor; id: string }
>(UPDATE_PERSONAL_DONOR_CERTIFICATE, async (payload, { rejectWithValue }) => {
    try {
        const response = await updatePersonalDonorCertificateApi(
            payload.id,
            payload.params
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const updateOrganizationDonorCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    { params: OrganizationDonor; id: string }
>(
    UPDATE_ORGANIZATION_DONOR_CERTIFICATE,
    async (payload, { rejectWithValue }) => {
        try {
            const response = await updateOrganizationDonorCertificateApi(
                payload.id,
                payload.params
            );
            return response;
        } catch (err: any) {
            return rejectWithValue({
                errorMessage: err.message,
                data: err.response.data,
            });
        }
    }
);

export const updateRecipientCertificateApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    { params: AddRecipientCertificate; id: string }
>(UPDATE_RECIPIENT_CERTIFICATE, async (payload, { rejectWithValue }) => {
    try {
        const response = await updateRecipientCertificateApi(
            payload.id,
            payload.params
        );
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const banAccountApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    BanAccountParams
>(BAN_ACCOUNT, async (payload, { rejectWithValue }) => {
    try {
        const response = await banAccountApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});

export const unbanAccountApiThunk = createAsyncThunk<
    ResponseFromServer<TextResponse>,
    UnBanAccountParams
>(UNBAN_ACCOUNT, async (payload, { rejectWithValue }) => {
    try {
        const response = await unbanAccountApi(payload);
        return response;
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: err.message,
            data: err.response.data,
        });
    }
});
