import { ILoginEmail, IRegisterEmail } from "@/types/auth";
import request from "../request";

export const loginApi = async (params: ILoginEmail) => {
    const data = await request.post('api/Auth/login', params);
    return data.data;
};

export const registerApi = async (params: IRegisterEmail) => {
    const data = await request.post('api/Auth/register', params);
    return data.data;
};

export const requestOTPApi = async (email: string) => {
    const data = await request.post('api/Auth/RequestOTP', { email });
    return data.data;
};

export const verifyOTPApi = async (email: string, otp: string) => {
    const data = await request.put('api/Auth/VerifyOTP', { email, otp });
    return data.data;
};

export const requestOtpForgetPasswordApi = async (email: string) => {
    const data = await request.post('api/Auth/RequestOtpForgetPassword', { email });
    return data.data;
};

export const resetPasswordApi = async (email: string, newPassword: string, otp: string) => {
    const data = await request.put('api/Auth/resetPassword', { email, newPassword, otp });
    return data.data;
};


