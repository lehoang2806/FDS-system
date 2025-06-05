import { FC } from "react";
import Modal from "./Modal"; // bạn đã có component Modal rồi
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";

interface DonorGuideModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const DonorGuideModal: FC<DonorGuideModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="account-permission-modal">
                <h2 className="title">Thông tin quyền hạn tài khoản</h2>

                <div className="permissions-section">
                    <div className="permission-block">
                        <h3>🔒 Chưa xác thực</h3>
                        <ul>
                            <li>
                                ✔️ Có thể ủng hộ hệ thống thông qua hình thức
                                chuyển khoản
                            </li>
                            <li>
                                ❌ Không thể tạo chiến dịch thiện nguyện cá nhân
                            </li>
                            <li>
                                ❌ Không nhận được thông báo khi có tin tức mới từ hệ thống
                            </li>
                        </ul>
                    </div>

                    <div className="permission-block">
                        <h3>🔓 Đã xác thực</h3>
                        <ul>
                            <li>
                                ✔️ Được phép tạo và quản lý chiến dịch thiện
                                nguyện
                            </li>
                            <li>
                                ✔️ Tự động nhận thông báo khi có
                                tin tức mới
                            </li>
                            <li>
                                ✔️ Có thể tiếp nhận và phản hồi các yêu cầu hỗ
                                trợ từ nhân viên hệ thống
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer">
                    <button
                        className="pr-btn"
                        onClick={() => {
                            navigateHook(routes.user.submit_certificate);
                            setIsOpen(false);
                        }}
                    >
                        Đi đến xác thực tài khoản
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DonorGuideModal;
