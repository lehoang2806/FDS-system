import { FC, useState } from 'react'
import Modal from './Modal'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/app/store';
import { AdditionalCertificateModalProps } from './type';
import { setLoading } from '@/services/app/appSlice';
import { additionalCertificateApiThunk, getOrganizationDonorCertificateByIdApiThunk, getPersonalDonorCertificateByIdApiThunk, getRecipientCertificateByIdApiThunk } from '@/services/user/userThunk';

const AdditionalCertificateModal: FC<AdditionalCertificateModalProps> = ({ isOpen, setIsOpen, selectedCertificate }) => {
    const dispatch = useAppDispatch();
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Vui lòng nhập điều cần bổ sung.");
            return;
        }

        if (!selectedCertificate) return;

        try {
            dispatch(setLoading(true));
            await dispatch(additionalCertificateApiThunk({
                certificateId: selectedCertificate.certificateId,
                content: content,
                type: selectedCertificate.type
            })).unwrap()
                .then(() => {
                    toast.success("Đã yêu cầu bổ sung.");
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
                }).catch(() => {
                }).finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000);
                });

        } catch (error) {
            toast.error("An error occurred while rejecting the certificate.");
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="additional-certificate-modal">
                <h1>Yêu cầu bổ sung đơn xác nhận</h1>
                <div className="acm-container">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <textarea
                                className="form-input"
                                placeholder="Vui lòng nhập điều cần bổ sung"
                                value={content}
                                rows={10}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="sc-btn">Gửi</button>
                    </form>
                </div>
            </section>
        </Modal>
    );
};


export default AdditionalCertificateModal