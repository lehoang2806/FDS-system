import { useEffect, useState } from "react";
import { Modal } from "../Modal";
import ChatBox from "./ChatBox";
import { useAppSelector } from "@/app/store";
import { selectUserLogin } from "@/app/selector";
import UserList from "./UserList";
import { ChatIconBox } from "@/assets/icons";
import chatConnection, { startChatConnection } from "@/SignalRChatService";

interface User {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    roleId: number;
}

const ChatIcon = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [unreadUsers, setUnreadUsers] = useState<Record<string, boolean>>({});
    const userLogin = useAppSelector(selectUserLogin);

    useEffect(() => {
        const key = `hasUnread_${userLogin?.accountId}`;
        const storedUnread = localStorage.getItem(key);
        setHasUnread(storedUnread === "true");
    }, [userLogin?.accountId]);

    useEffect(() => {
        const handleReceiveMessage = (msg: any) => {
            const isFromOther =
                msg.senderId !== selectedUser?.userId &&
                msg.senderId !== userLogin?.accountId;

            if (isFromOther) {
                setHasUnread(true);
                const key = `hasUnread_${userLogin?.accountId}`;
                localStorage.setItem(key, "true");

                setUnreadUsers((prev) => ({
                    ...prev,
                    [msg.senderId]: true,
                }));
            }
        };

        startChatConnection().then(() => {
            chatConnection.on("ReceiveMessage", handleReceiveMessage);
        });

        return () => {
            chatConnection.off("ReceiveMessage", handleReceiveMessage);
        };
    }, [selectedUser, userLogin]);

    const openChat = () => {
        setIsOpen(true);
        setHasUnread(false);
        const key = `hasUnread_${userLogin?.accountId}`;
        localStorage.removeItem(key);
    };

    const openChatWithUser = (user: User) => {
        setSelectedUser(user);
        setUnreadUsers((prev) => ({
            ...prev,
            [user.userId]: false,
        }));
    };

    return (
        <>
            <div
                className={`chat-icon ${hasUnread ? "blinking" : ""}`}
                onClick={openChat}
            >
                <ChatIconBox className="chat-icon-icon" />
                {hasUnread && (
                    <span
                        style={{
                            position: "absolute",
                            right: 50,
                            top: -10,
                            backgroundColor: "#460d02",
                            color: "white",
                            fontWeight: "bold",
                            width: "200px",
                            textAlign: "center",
                            padding: "10px 15px",
                            borderRadius: "10px",
                        }}
                    >
                        Có tin nhắn đến
                    </span>
                )}
            </div>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="chat-modal">
                    <div className="chat-modal-left">
                        <UserList
                            onSelectUser={openChatWithUser}
                            selectedUserId={selectedUser?.userId}
                            title="Danh sách nhân viên của hệ thống"
                            unreadUsers={unreadUsers}
                        />
                    </div>
                    <div className="chat-modal-right">
                        {selectedUser ? (
                            <ChatBox
                                selectedUserId={selectedUser.userId}
                                selectedUserName={selectedUser.fullName}
                                currentUserId={String(userLogin?.accountId)}
                            />
                        ) : (
                            <p className="chat-modal-right-empty">
                                Chọn tài khoản để bắt đầu trò chuyện.
                            </p>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ChatIcon;
