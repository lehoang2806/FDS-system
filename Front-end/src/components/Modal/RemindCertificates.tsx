import { FC } from 'react'
import Modal from './Modal'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { RemindCertificateModalProps } from './type'

const RemindCertificateModal: FC<RemindCertificateModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Remind Certificate">
            <section id="remind-certificate-modal">
                <div className="rcm-container">
                    <h1>Bạn cần nộp chứng chỉ để có thể đăng ký nhận quà</h1>
                    <button className="sc-btn" onClick={() => {navigateHook(`${routes.user.personal}?tab=chungchi`); setIsOpen(false)}}>Nộp chứng chỉ</button>
                </div>
            </section>
        </Modal>
    )
}

export default RemindCertificateModal