import { selectUserLogin } from "@/app/selector";
import { useAppSelector } from "@/app/store";
import { AvatarIcon } from "@/assets/icons";
import { useEffect, useState } from "react";

interface User {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    roleId: number;
}

interface Props {
    onSelectUser: (user: User) => void;
    selectedUserId?: string;
    title?: string;
    preselectedEmail?: string;
    unreadUsers?: Record<string, boolean>;
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

const UserList = ({
    onSelectUser,
    selectedUserId,
    title,
    preselectedEmail,
    unreadUsers,
}: Props) => {
    const [users, setUsers] = useState<User[]>([]);
    const userLogin = useAppSelector(selectUserLogin);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users
        .filter((u) => u.email.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const aUnread = unreadUsers?.[a.userId] ? 1 : 0;
            const bUnread = unreadUsers?.[b.userId] ? 1 : 0;

            // Ưu tiên user có tin nhắn chưa đọc
            if (bUnread !== aUnread) return bUnread - aUnread;

            // Nếu bằng nhau thì đưa selectedUser lên đầu
            if (a.userId === selectedUserId) return -1;
            if (b.userId === selectedUserId) return 1;

            return 0;
        });

    useEffect(() => {
        if (preselectedEmail && users.length > 0) {
            const matchedUser = users.find(
                (u) => u.email.toLowerCase() === preselectedEmail.toLowerCase()
            );
            if (matchedUser) {
                onSelectUser(matchedUser);
            }
        }
    }, [users, preselectedEmail]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = getToken();
            if (!token || !userLogin) return;

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chat/GetUserForChat`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data: User[] = await res.json();

            // Lọc bỏ chính user đang đăng nhập
            const others = data.filter((u) => u.userId !== userLogin.accountId);

            // Áp dụng lọc theo roleId
            const filtered = others.filter((u) => {
                if ([3, 4].includes(userLogin.roleId)) {
                    return [1, 2].includes(u.roleId);
                }
                if ([1, 2].includes(userLogin.roleId)) {
                    return [3, 4].includes(u.roleId);
                }
                return false; // Các role khác nếu cần
            });

            setUsers(filtered);
        };

        fetchUsers();
    }, [userLogin]);

    return (
        <div>
            <h1>{title}</h1>
            <p>Tìm kiếm</p>
            <input
                type="text"
                className="pr-input"
                placeholder="Tìm kiếm tài khoản theo email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredUsers.map((u) => (
                <div
                    key={u.userId}
                    className={`user-item ${
                        selectedUserId === u.userId ? "active" : ""
                    }`}
                    onClick={() => onSelectUser(u)}
                    style={{
                        backgroundColor: unreadUsers?.[u.userId]
                            ? "#ffe9c6"
                            : "",
                    }}
                >
                    <img src={AvatarIcon} alt="" />
                    <div>
                        <h2
                            style={{
                                fontWeight: unreadUsers?.[u.userId]
                                    ? "bold"
                                    : "normal",
                            }}
                        >
                            {u.fullName}
                        </h2>
                        {(userLogin?.roleId === 1 ||
                            userLogin?.roleId === 2) && (
                            <p style={{ fontSize: "14px", marginTop: "5px" }}>
                                {u.roleId === 3
                                    ? "Người tặng thực phẩm"
                                    : "Người nhận hỗ trợ"}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserList;
