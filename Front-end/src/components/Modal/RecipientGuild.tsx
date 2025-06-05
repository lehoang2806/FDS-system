import { FC } from "react";
import Modal from "./Modal"; // bạn đã có component Modal rồi
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";

interface RecipientGuideModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const RecipientGuideModal: FC<RecipientGuideModalProps> = ({
    isOpen,
    setIsOpen,
}) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="account-permission-modal">
                <h2 className="title">Quyền lợi của tài khoản</h2>

                <div className="permissions-section">
                    <div className="permission-block">
                        <h3>
                            🔒 Tài khoản <strong>chưa xác thực</strong>
                        </h3>
                        <ul>
                            <li>
                                ✔️ Có thể đăng ký tham gia nhận hỗ trợ từ các
                                chiến dịch thiện nguyện đang mở
                            </li>
                            <li>
                                ❌ Không thể gửi yêu cầu hỗ trợ cá nhân đến nhân
                                viên hệ thống
                            </li>
                            <li>
                                ❌ Không nhận được thông báo tự động khi có
                                chiến dịch hoặc tin tức mới
                            </li>
                        </ul>
                    </div>

                    <div className="permission-block">
                        <h3>
                            🔓 Tài khoản <strong>đã xác thực</strong>
                        </h3>
                        <ul>
                            <li>
                                ✔️ Có thể gửi yêu cầu hỗ trợ trực tiếp đến nhân
                                viên hệ thống
                            </li>
                            <li>
                                ✔️ Luôn được cập nhật thông tin mới nhất về
                                chiến dịch và tin tức thông qua thông báo hệ
                                thống
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer">
                    <button
                        className="pr-btn"
                        onClick={() => {
                            navigateHook(`${routes.user.personal}?tab=chungchi`);
                            setIsOpen(false);
                        }}
                    >
                        Xác thực tài khoản ngay
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RecipientGuideModal;
