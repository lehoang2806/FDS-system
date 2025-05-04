import * as signalR from "@microsoft/signalr";

// Lấy token từ localStorage an toàn hơn
const getToken = () => {
    try {
        const persistData = localStorage.getItem("persist:root");
        return persistData ? JSON.parse(JSON.parse(persistData).auth).token : null;
    } catch (error) {
        return null;
    }
};

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}/notificationhub`, {
        accessTokenFactory: () => getToken() || "", // Tránh lỗi nếu token null
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const startConnection = async () => {
    if (connection.state === signalR.HubConnectionState.Connected) {
        return;
    }

    try {
        await connection.start();
    } catch (err) {
        setTimeout(() => startConnection(), 5000);
    }
};

export default connection;
