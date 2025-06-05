import { FC, useState } from 'react'
import Modal from './Modal'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/app/store';
import { setLoading } from '@/services/app/appSlice';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { AdditionalCampaignRequestSupportModalProps } from './type';
import { additionalCampaignRequestSupportApiThunk, getAllCampaignRequestSupportApiThunk } from '@/services/campaignRequestSupport/campaignRequestSupportThunk';

const AdditionalCampaignRequestSupportModal: FC<AdditionalCampaignRequestSupportModalProps> = ({ isOpen, setIsOpen, selectedCampaignRequestSupport }) => {
    const dispatch = useAppDispatch();
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Vui lòng nhập điều cần bổ sung.");
            return;
        }

        if (!selectedCampaignRequestSupport) return;

        try {
            dispatch(setLoading(true));
            await dispatch(additionalCampaignRequestSupportApiThunk({
                campaignRequestSupportId: selectedCampaignRequestSupport.campaignRequestSupportId,
                content: content
            })).unwrap()
                .then(() => {
                    toast.success("Đã yêu cầu bổ sung.");
                    setIsOpen(false);
                    dispatch(getAllCampaignRequestSupportApiThunk());
                    navigateHook(routes.staff.campaign.request_support.list);
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
            <section id="additional-campaign-modal">
                <div className="acm-container">
                <h1>Yêu cầu bổ sung</h1>
                <form className="form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label className="form-label">Yêu cầu bổ sung</label>
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


export default AdditionalCampaignRequestSupportModal