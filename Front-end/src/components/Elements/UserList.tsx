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

const UserList = ({ onSelectUser, selectedUserId }: Props) => {
    const [users, setUsers] = useState<User[]>([]);
    const userLogin = useAppSelector(selectUserLogin);

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
                    return [1, 2].includes(u.roleId);
                }
                return false; // Các role khác nếu cần
            });

            setUsers(filtered);
        };

        fetchUsers();
    }, [userLogin]);

    return (
        <div>
            <h1>Danh sách nhân viên của hệ thống</h1>
            {users.map((u) => (
                <div
                    key={u.userId}
                    className={`user-item ${
                        selectedUserId === u.userId ? "active" : ""
                    }`}
                    onClick={() => onSelectUser(u)}
                >
                    <img src={AvatarIcon} alt="" />
                    <h2>{u.fullName}</h2>
                </div>
            ))}
        </div>
    );
};

export default UserList;
