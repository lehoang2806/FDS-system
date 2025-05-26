import { selectUserLogin } from "@/app/selector";
import { useAppSelector } from "@/app/store";
import { ChatBox, UserList } from "@/components/Elements";
import chatConnection, { startChatConnection } from "@/SignalRChatService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface User {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    roleId: number;
}

const StaffChatWithUserPage = () => {
    const location = useLocation();
    const preselectedEmail = location.state?.email;
    const userLogin = useAppSelector(selectUserLogin);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [unreadUsers, setUnreadUsers] = useState<Record<string, boolean>>({});

    // Kết nối SignalR và lắng nghe tin nhắn đến
    useEffect(() => {
        const handleReceiveMessage = (msg: any) => {
            const isFromOther =
                msg.senderId !== selectedUser?.userId &&
                msg.senderId !== userLogin?.accountId;

            if (isFromOther) {
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

    // Khi chọn user thì bỏ trạng thái chưa đọc của họ
    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setUnreadUsers((prev) => ({
            ...prev,
            [user.userId]: false,
        }));
    };

    return (
        <section id="staff-chat-with-user" className="staff-section">
            <div className="staff-container scwu-conatiner">
                <div className="scwucr1">
                    <h1>Đơn yêu cầu hỗ trợ</h1>
                    <p>
                        Trang tổng quát
                        <span className="staff-tag">Đơn yêu cầu hỗ trợ</span>
                    </p>
                </div>
                <div className="scwucr2">
                    <div className="scwucr2c1">
                        <UserList
                            onSelectUser={handleSelectUser}
                            selectedUserId={selectedUser?.userId}
                            title="Danh sách người dùng"
                            preselectedEmail={preselectedEmail}
                            unreadUsers={unreadUsers}
                        />
                    </div>
                    <div className="scwucr2c2">
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
            </div>
        </section>
    );
};

export default StaffChatWithUserPage;
