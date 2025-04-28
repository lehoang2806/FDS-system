import { FC } from 'react'
import { RemindLoginModalProps } from './type'
import Modal from './Modal'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { RemindLogin } from '@/assets/images'

const RemindLoginModal: FC<RemindLoginModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Thông báo">
            <section id="remind-login-modal">
                <div className="rlm-container">
                    <img src={RemindLogin} alt="" />
                    <h3>Chào mừng bạn đến với nền tảng thiện nguyện FDS-System</h3>
                    <h4>Chúng tôi sẽ giúp bạn có trải nghiệm thiện nguyện thật khác biệt</h4>
                    <button onClick={() => {navigateHook(routes.login); setIsOpen(false)}} className="sc-btn">Đăng nhập hoặc tạo tài khoảng</button>
                    <p onClick={() => setIsOpen(false)}>Lúc khác</p>
                </div>
            </section>
        </Modal>

    )
}

export default RemindLoginModal