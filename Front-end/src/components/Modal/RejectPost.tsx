import { FC, useState } from 'react'
import Modal from './Modal'
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/app/store';
import { setLoading } from '@/services/app/appSlice';
import { RejectPostModalProps } from './type';
import { getAllPostsApiThunk, rejectPostApiThunk } from '@/services/post/postThunk';

const RejectPostModal: FC<RejectPostModalProps> = ({ isOpen, setIsOpen, selectedRejectPost }) => {
    const dispatch = useAppDispatch();
    const [reason, setReason] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối.");
            return;
        }

        if (!selectedRejectPost) return;

        try {
            dispatch(setLoading(true));
            await dispatch(rejectPostApiThunk({
                postId: selectedRejectPost.postId,
                comment: reason
            })).unwrap()
                .then(() => {
                    toast.success("Đã từ chối bài viết này.");
                    setIsOpen(false);
                    dispatch(getAllPostsApiThunk());
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
                    <h1>Từ chối Bài viết</h1>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Vui lòng nhập lý do từ chối bài viết này"
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


export default RejectPostModal