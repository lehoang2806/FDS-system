import { OrganizationDonorModal, PersonalDonorModal } from "@/components/Modal"
import { useState } from "react"

const UserSubmitCertificatePage = () => {
    const [isPersonalDonorModalOpen, setIsPersonalDonorModalOpen] = useState(false)
    const [isOrganizationDonorModalOpen, setIsOrganizationDonorModalOpen] = useState(false)

    return (
        <section id="user-submit-certificate">
            <h1>Xác nhận danh tính</h1>
            <div className="usc-container">
                <div className="col-flex usccc1">
                    <button className="sc-btn" onClick={() => setIsPersonalDonorModalOpen(true)}>Bạn là tài khoản cá nhân</button>
                </div>
                <div className="col-flex usccc2">
                    <button className="pr-btn" onClick={() => setIsOrganizationDonorModalOpen(true)}>Bạn là tài khoản tổ chức</button>
                </div>
            </div>
            <PersonalDonorModal isOpen={isPersonalDonorModalOpen} setIsOpen={setIsPersonalDonorModalOpen} />
            <OrganizationDonorModal isOpen={isOrganizationDonorModalOpen} setIsOpen={setIsOrganizationDonorModalOpen} />
        </section>
    )
}

export default UserSubmitCertificatePage