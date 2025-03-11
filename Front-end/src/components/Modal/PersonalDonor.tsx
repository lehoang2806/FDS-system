import { FC } from 'react'
import Modal from './Modal'

const PersonalDonorModal: FC<PersonalDonorModalProps> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Personal Donor">
            <section id="personal-donor-modal">
                <div className="pdm-container">
                    <h1>Đăng ký thành cá nhân ủng hộ</h1>
                    <form className="form">
                        <div className="form-field">
                            <label className="form-label">Căn cước công dân</label>
                            <input type="text" className="form-input" placeholder='Vui lòng nhập số căn cước công dân của bạn'/>
                        </div>
                        <button className="sc-btn">Đăng ký</button>
                    </form>
                </div>
            </section>
        </Modal>
    )
}

export default PersonalDonorModal