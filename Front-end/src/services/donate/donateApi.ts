import request from "../request";

export const getAllDonateApi = async () => {
    const data = await request.get('api/donordonate/GetAllDonorDonates');
    return data.data;
};