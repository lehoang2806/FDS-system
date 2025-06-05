import request from "../request";

export const getAllDonateApi = async () => {
    const data = await request.get('api/donordonate/GetAllDonorDonates');
    return data.data;
};

export const getDonateByIdApi = async (donateId: string) => {
    const data = await request.get(`api/donordonate/GetDonorDonateById/${donateId}`);
    return data.data;
}