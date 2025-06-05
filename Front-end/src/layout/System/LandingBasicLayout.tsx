import { Outlet } from "react-router-dom";
import { HeaderLanding } from "../../components/Header/index";
import { FC } from "react";
import { FooterLanding } from "@/components/Footer";
import { useAppSelector } from "@/app/store";
import { selectIsAuthenticated, selectUserLogin } from "@/app/selector";
import { ChatIcon } from "@/components/Elements";
import Unauthorized from "@/pages/System/Unauthorized";
import { Modal } from "@/components/Modal";
import { logoutToLogin } from "@/utils/helper";

const LandingBasicLayout: FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userLogin = useAppSelector(selectUserLogin);

    const isBanned = userLogin?.isBanned === true;
    const isUnauthorized = userLogin?.roleId === 1 || userLogin?.roleId === 2;

    if (isUnauthorized) {
        return <Unauthorized />;
    }

    const handleBackToLogin = () => {
        logoutToLogin();
    };

    return (
        <div style={{ position: "relative" }}>
            <HeaderLanding isLogin={isAuthenticated} />
            <main id="landing">
                <Outlet />
            </main>
            <FooterLanding />
            {isAuthenticated && <ChatIcon />}

            {/* Modal khi bị khóa tài khoản */}
            {isBanned && (
                <Modal isOpen={true} setIsOpen={() => {}} disableOutsideClick>
                    <div className="banned-account">
                        <h2>Tài khoản của bạn đã bị khóa</h2>
                        <p>
                            Vui lòng liên hệ với chúng tôi để biết thêm chi
                            tiết:
                        </p>
                        <ul className="contact-info">
                            <li>
                                <strong>Email:</strong> tuanpcl7103@gmail.com
                            </li>
                            <li>
                                <strong>SĐT:</strong> 0898 530 964
                            </li>
                        </ul>
                        <button onClick={handleBackToLogin} className="sc-btn">
                            Quay lại trang đăng nhập
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default LandingBasicLayout;
