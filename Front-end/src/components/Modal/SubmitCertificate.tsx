import { FC } from 'react'
import Modal from './Modal'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'

const SubmitCertificateModal: FC<SubmitCertificateModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Submit Certificate">
            <section id="submit-certificate-modal">
                <div className="scm-container">
                    <h1>Bạn cần nộp chứng chỉ để có thể tạo chiến dịch</h1>
                    <button className="sc-btn" onClick={() => {navigateHook(routes.user.submit_certificate); setIsOpen(false)}}>Nộp chứng chỉ</button>
                </div>
            </section>
        </Modal>
    )
}

export default SubmitCertificateModal