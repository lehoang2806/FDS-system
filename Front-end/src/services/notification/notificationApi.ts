import request from "../request";

export const readNotificationApi = async (notificationId: string) => {
    const data = await request.put(`api/notification/Read/${notificationId}`);
    return data.data;
}