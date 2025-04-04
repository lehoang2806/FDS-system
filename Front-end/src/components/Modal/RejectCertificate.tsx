import { FC, useState } from 'react'
import Modal from './Modal'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/app/store';
import { RejectCertificateModalProps } from './type';
import { getOrganizationDonorCertificateByIdApiThunk, getPersonalDonorCertificateByIdApiThunk, getRecipientCertificateByIdApiThunk, rejectCertificateApiThunk } from '@/services/user/userThunk';
import { setLoading } from '@/services/app/appSlice';

const RejectCertificateModal: FC<RejectCertificateModalProps> = ({ isOpen, setIsOpen, selectedCertificate }) => {
    const dispatch = useAppDispatch();
    const [reason, setReason] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối.");
            return;
        }

        if (!selectedCertificate) return;

        try {
            dispatch(setLoading(true));
            await dispatch(rejectCertificateApiThunk({
                certificateId: selectedCertificate.certificateId,
                type: selectedCertificate.type,
                comment: reason
            })).unwrap()
                .then(() => {
                    toast.success("Reject Certificate successfully.");
                    setIsOpen(false);
                    if (selectedCertificate.type === 1) {
                        dispatch(getPersonalDonorCertificateByIdApiThunk(selectedCertificate.certificateId));
                    }
                    else if (selectedCertificate.type === 2) {
                        dispatch(getOrganizationDonorCertificateByIdApiThunk(selectedCertificate.certificateId));
                    }
                    else if (selectedCertificate.type === 3) {
                        dispatch(getRecipientCertificateByIdApiThunk(selectedCertificate.certificateId));
                    }
                })
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000);
                });
        } catch (error) {
            toast.error("An error occurred while rejecting the certificate.");
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Reject Certificate">
            <section id="reject-certificate-modal">
                <div className="rcm-container">
                    <h1>Từ chối chứng chỉ</h1>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label className="form-label">Lý do từ chối</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Vui lòng nhập lý do từ chối chứng chỉ"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="sc-btn">Xác nhận</button>
                    </form>
                </div>
            </section>
        </Modal>
    );
};


export default RejectCertificateModal