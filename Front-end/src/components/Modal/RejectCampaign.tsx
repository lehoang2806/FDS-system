import { FC, useState } from 'react'
import Modal from './Modal'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/app/store';
import { RejectCampaignModalProps } from './type';
import { getAllCampaignApiThunk, getCampaignByIdApiThunk, rejectCampaignApiThunk } from '@/services/campaign/campaignThunk';
import { setLoading } from '@/services/app/appSlice';

const RejectCampaignModal: FC<RejectCampaignModalProps> = ({ isOpen, setIsOpen, selectedCampaign }) => {
    const dispatch = useAppDispatch();
    const [reason, setReason] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối.");
            return;
        }

        if (!selectedCampaign) return;

        try {
            dispatch(setLoading(true));
            await dispatch(rejectCampaignApiThunk({
                campaignId: selectedCampaign.campaignId,
                comment: reason
            })).unwrap()
                .then(() => {
                    toast.success("Reject Campaign successfully.");
                    setIsOpen(false);
                    dispatch(getAllCampaignApiThunk());
                    dispatch(getCampaignByIdApiThunk(selectedCampaign.campaignId));
                }).catch(() => {
                }).finally(() => {
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
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Reject Campaign">
            <section id="reject-campaign-modal">
                <div className="rcm-container">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label className="form-label">Lý do từ chối</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Vui lòng nhập lý do từ chối chiến dịch này"
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


export default RejectCampaignModal