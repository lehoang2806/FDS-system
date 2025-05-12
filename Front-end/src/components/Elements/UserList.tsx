import { selectUserLogin } from "@/app/selector";
import { useAppSelector } from "@/app/store";
import { useEffect, useState } from "react";

interface User {
    userId: string;
    fullName: string;
}

interface Props {
    onSelectUser: (user: User) => void;
    selectedUserId?: string;
}

const getToken = (): string | null => {
    try {
        const persistData = localStorage.getItem("persist:root");
        return persistData ? JSON.parse(JSON.parse(persistData).auth).token : null;
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

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/GetUserForChat`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data: User[] = await res.json();

            // ⚠️ Lọc bỏ user đang đăng nhập
            const filtered = data.filter(u => u.userId !== userLogin.accountId);
            setUsers(filtered);
        };

        fetchUsers();
    }, [userLogin]);

    return (
        <div>
            {users.map(u => (
                <div
                    key={u.userId}
                    className={`user-item ${selectedUserId === u.userId ? "active" : ""}`}
                    onClick={() => onSelectUser(u)}
                >
                    <h2>{u.fullName}</h2>
                </div>
            ))}
        </div>
    );
};

export default UserList;

// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/app/store";
// import { selectUserLogin } from "@/app/selector";

// interface User {
//     userId: string;
//     fullName: string;
//     roleId?: number;
// }

// interface Props {
//     onSelectUser: (user: User) => void;
// }

// const getToken = (): string | null => {
//     try {
//         const persistData = localStorage.getItem("persist:root");
//         return persistData ? JSON.parse(JSON.parse(persistData).auth).token : null;
//     } catch {
//         return null;
//     }
// };

// const UserList = ({ onSelectUser }: Props) => {
//     const [users, setUsers] = useState<User[]>([]);
//     const userLogin = useAppSelector(selectUserLogin);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             const token = getToken();
//             if (!token || !userLogin) return;

//             const headers = { Authorization: `Bearer ${token}` };

//             let url = "";
//             let needFilterRole2 = false;

//             if (userLogin.roleId === 1 || userLogin.roleId === 2) {
//                 url = `${import.meta.env.VITE_API_URL}/api/chat/GetUserForChat`;
//             } else if (userLogin.roleId === 3 || userLogin.roleId === 4) {
//                 url = `${import.meta.env.VITE_API_URL}/api/chat/GetChattedUser`;
//                 needFilterRole2 = true;
//             } else {
//                 url = `${import.meta.env.VITE_API_URL}/api/chat/GetUserForChat`;
//             }

//             try {
//                 const res = await fetch(url, { headers });
//                 const data: User[] = await res.json();

//                 const filteredUsers = needFilterRole2
//                     ? data.filter(u => u.roleId === 2)
//                     : data;

//                 setUsers(filteredUsers);
//             } catch (error) {
//                 console.error("❌ Lỗi khi tải danh sách người dùng:", error);
//             }
//         };

//         fetchUsers();
//     }, [userLogin]);

//     return (
//         <div>
//             <h3>👥 Danh sách</h3>
//             {users.length === 0 ? (
//                 <p>Không có người dùng để hiển thị.</p>
//             ) : (
//                 users.map(u => (
//                     <div key={u.userId} className="user-item" onClick={() => onSelectUser(u)}>
//                         {u.fullName}
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default UserList;

