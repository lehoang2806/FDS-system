import { FC } from "react"
import Modal from "./Modal"
import { RejectReasonModalProps } from "./type"

const RejectReasonModal: FC<RejectReasonModalProps> = ({isOpen, setIsOpen, reason}) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Reason Reject">
            <section id="reject-campaign-modal">
                <div className="rcm-container">
                    <h1>{reason}</h1>
                </div>
            </section>
        </Modal>
    )
}

export default RejectReasonModal