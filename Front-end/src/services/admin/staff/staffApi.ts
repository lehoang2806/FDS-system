import { AddStaff } from "@/types/user";
import request from "../../request";

export const addStaffApi = async (params: AddStaff) => {
    const data = await request.post('api/user/AddStaff', params);
    return data.data;
};