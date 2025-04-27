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
                    toast.success("Đã từ chối chiến dịch này.");
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
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="reject-campaign-modal">
                <div className="rcm-container">
                    <h1>Từ chối chiến dịch</h1>
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
                        <button type="submit" className="sc-btn">Gửi</button>
                    </form>
                </div>
            </section>
        </Modal>
    );
};


export default RejectCampaignModal