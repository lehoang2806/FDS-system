import { FC } from 'react'
import Modal from './Modal'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { SubmitCertificateModalProps } from './type'

const SubmitCertificateModal: FC<SubmitCertificateModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="">
            <section id="submit-certificate-modal">
                <div className="scm-container">
                    <h1>Bạn cần xác nhận danh tính để có thể tạo chiến dịch</h1>
                    <button className="sc-btn" onClick={() => {navigateHook(routes.user.submit_certificate); setIsOpen(false)}}>Đi đến xác nhận danh tính</button>
                </div>
            </section>
        </Modal>
    )
}

export default SubmitCertificateModal