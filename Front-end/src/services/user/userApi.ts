import request from "../request";

export const getAllUserApi = async () => {
    const data = await request.get('api/user/GetAllUser');
    return data.data;
};