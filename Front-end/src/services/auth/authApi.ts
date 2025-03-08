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
