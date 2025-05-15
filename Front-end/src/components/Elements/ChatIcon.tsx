import { useState } from "react"
import { Modal } from "../Modal"
import ChatBox from "./ChatBox";
import { useAppSelector } from "@/app/store";
import { selectUserLogin } from "@/app/selector";
import UserList from "./UserList";
import { ChatIconBox } from "@/assets/icons";

interface User {
    userId: string;
    fullName: string;
}

const ChatIcon = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false)
    const userLogin = useAppSelector(selectUserLogin);

    return (
        <>
            <div className="chat-icon" onClick={() => setIsOpen(true)}>
                <ChatIconBox className="chat-icon-icon"/>
            </div>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="chat-modal">
                    <div className="chat-modal-left"> 
                        <UserList onSelectUser={setSelectedUser} selectedUserId={selectedUser?.userId}/>
                    </div>
                    <div className="chat-modal-right">
                        {selectedUser ? (
                            <ChatBox
                                selectedUserId={selectedUser.userId}
                                selectedUserName={selectedUser.fullName}
                                currentUserId={String(userLogin?.accountId)}
                            />
                        ) : (
                            <p className="chat-modal-right-empty">Chọn tài khoản để bắt đầu trò chuyện.</p>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ChatIcon