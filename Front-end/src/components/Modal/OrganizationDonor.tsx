import { FC } from 'react'
import Modal from './Modal'

const OrganizationDonorModal: FC<OrganizationDonorModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Organization Donor">
            <section id="organization-donor-modal">
                <div className="odm-container">
                    <h1>Đăng ký thành tổ chức ủng hộ</h1>
                    <form className="form">
                        <div className="form-field">
                            <label className="form-label">Tên tổ chức</label>
                            <input type="text" className="form-input" placeholder='Vui lòng nhập tên tổ chức của bạn' />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Mã số thuế</label>
                            <input type="text" className="form-input" placeholder='Vui lòng nhập mã số thuế của bạn' />
                        </div>
                        <button className="sc-btn">Đăng ký</button>
                    </form>
                </div>
            </section>
        </Modal>
    )
}

export default OrganizationDonorModal