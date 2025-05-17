import { AvatarIcon } from "@/assets/icons";
import chatConnection, { startChatConnection } from "@/SignalRChatService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.locale("vi");
dayjs.extend(relativeTime);

interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    createdDate: string;
}

interface Props {
    selectedUserId: string;
    selectedUserName: string;
    currentUserId: string;
}

const getToken = (): string | null => {
    try {
        const persistData = localStorage.getItem("persist:root");
        return persistData
            ? JSON.parse(JSON.parse(persistData).auth).token
            : null;
    } catch {
        return null;
    }
};

const ChatBox = ({
    selectedUserId,
    selectedUserName,
    currentUserId,
}: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!selectedUserId) return;

        fetch(
            `${
                import.meta.env.VITE_API_URL
            }/api/chat/GetHistory/${selectedUserId}`,
            {
                headers: { Authorization: `Bearer ${getToken()}` },
            }
        )
            .then((res) => res.json())
            .then((data: Message[]) => setMessages(data));
    }, [selectedUserId]);

    useEffect(() => {
        const handleMessage = (msg: Message) => {
            if (
                msg.senderId === selectedUserId ||
                msg.receiverId === selectedUserId
            ) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        startChatConnection().then(() => {
            chatConnection.on("ReceiveMessage", handleMessage);
        });

        return () => {
            chatConnection.off("ReceiveMessage", handleMessage);
        };
    }, [selectedUserId]);

    const sendMessage = () => {
        if (!input.trim()) return;
        chatConnection.invoke("SendMessage", selectedUserId, input);
        setInput("");
    };

    return (
        <div>
            <h3>
                <img src={AvatarIcon} className="avatar" />
                {selectedUserName}
            </h3>
            <div id="chat-box">
                {messages.length > 0 ? (
                    messages.map((m, i) => (
                        <div
                            key={i}
                            className={
                                m.senderId === currentUserId ? "right" : "left"
                            }
                            style={{
                                textAlign:
                                    m.senderId === currentUserId
                                        ? "right"
                                        : "left",
                            }}
                        >
                            <p
                                className={
                                    m.senderId === currentUserId
                                        ? "text-right"
                                        : "text-left"
                                }
                            >
                                {m.content}
                            </p>
                            <p className="time">
                                {m.createdDate
                                    ? dayjs(m.createdDate).fromNow()
                                    : ""}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="no-message">Chưa có tin nhắn</p>
                )}
            </div>
            <div id="chat-input-container">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn"
                    className="pr-input"
                />
                <button className="pr-btn" onClick={sendMessage}>
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
