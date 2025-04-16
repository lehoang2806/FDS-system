import * as signalR from "@microsoft/signalr";

// Lấy token từ localStorage an toàn hơn
const getToken = () => {
  try {
    const persistData = localStorage.getItem("persist:root");
    return persistData ? JSON.parse(JSON.parse(persistData).auth).token : null;
  } catch (error) {
    console.error("❌ Lỗi khi lấy token từ localStorage:", error);
    return null;
  }
};

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5213/notificationhub", {
    accessTokenFactory: () => getToken() || "", // Tránh lỗi nếu token null
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export const startConnection = async () => {
  if (connection.state === signalR.HubConnectionState.Connected) {
    console.log("🔌 SignalR is already connected.");
    return;
  }

  try {
    await connection.start();
    console.log("✅ SignalR Connected!");
  } catch (err) {
    console.error("❌ SignalR Connection Error:", err);
    setTimeout(() => startConnection(), 5000);
  }
};

export default connection;
