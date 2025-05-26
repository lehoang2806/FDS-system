import { selectUserLogin } from "@/app/selector";
import { useAppSelector } from "@/app/store";
import { ChatBox, UserList } from "@/components/Elements";
import { useState } from "react";
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
                            onSelectUser={setSelectedUser}
                            selectedUserId={selectedUser?.userId}
                            title="Danh sách người dùng"
                            preselectedEmail={preselectedEmail}
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
