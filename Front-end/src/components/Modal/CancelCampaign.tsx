import { FC, useState } from 'react'
import Modal from './Modal'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/app/store';
import { cancelCampaignApiThunk, getAllCampaignApiThunk, getCampaignByIdApiThunk } from '@/services/campaign/campaignThunk';
import { setLoading } from '@/services/app/appSlice';
import { CancelCampaignModalProps } from './type';

const CancelCampaignModal: FC<CancelCampaignModalProps> = ({ isOpen, setIsOpen, selectedCampaign }) => {
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
            await dispatch(cancelCampaignApiThunk({
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
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="cancel-campaign-modal">
                <div className="ccm-container">
                    <form className="form" onSubmit={handleSubmit}>
                        <h1>Xác nhận hủy chiến dịch</h1>
                        <div className="form-field">
                            <label className="form-label">Lý do hủy chiến dịch</label>
                            <textarea
                            cols={30}
                            rows={10}
                                className="form-input"
                                placeholder="Vui lòng nhập lý do hủy chiến dịch này"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                        <p><span>Ghi chú:</span> Bạn chỉ được hủy chiến dịch trong vòng 24 giờ kể từ khi bạn tạo chiến dịch.</p>
                        <button type="submit" className="sc-btn">Xác nhận</button>
                    </form>
                </div>
            </section>
        </Modal>
    );
};


export default CancelCampaignModal