import { OrganizationIcon, PersonalIcon } from "@/assets/icons"
import { OrganizationDonorModal, PersonalDonorModal } from "@/components/Modal"
import { useState } from "react"

const UserSubmitCertificatePage = () => {
    const [isPersonalDonorModalOpen, setIsPersonalDonorModalOpen] = useState(false)
    const [isOrganizationDonorModalOpen, setIsOrganizationDonorModalOpen] = useState(false)

    return (
        <section id="user-submit-certificate">
            <h1>Xác nhận thông tin cá nhân</h1>
            <div className="usc-container">
                <div className="col-flex usccc1">
                    <button className="sc-btn" onClick={() => setIsPersonalDonorModalOpen(true)}><PersonalIcon className="usc-icon"/> Xác minh tài khoản cá nhân</button>
                </div>
                <div className="col-flex usccc2">
                    <button className="pr-btn" onClick={() => setIsOrganizationDonorModalOpen(true)}><OrganizationIcon className="usc-icon"/> Xác minh tài khoản tổ chức</button>
                </div>
            </div>
            <PersonalDonorModal isOpen={isPersonalDonorModalOpen} setIsOpen={setIsPersonalDonorModalOpen} />
            <OrganizationDonorModal isOpen={isOrganizationDonorModalOpen} setIsOpen={setIsOrganizationDonorModalOpen} />
        </section>
    )
}

export default UserSubmitCertificatePage