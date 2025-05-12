import * as signalR from "@microsoft/signalr";

const getToken = () => {
    try {
        const persistData = localStorage.getItem("persist:root");
        return persistData ? JSON.parse(JSON.parse(persistData).auth).token : null;
    } catch {
        return null;
    }
};

const chatConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}/chathub`, {
        accessTokenFactory: () => getToken() || "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const startChatConnection = async () => {
    if (chatConnection.state !== signalR.HubConnectionState.Connected) {
        try {
            await chatConnection.start();
        } catch {
            setTimeout(startChatConnection, 3000);
        }
    }
};

export default chatConnection;
