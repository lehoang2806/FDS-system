import { FarvoriteIcon } from '@/assets/icons';
import { FC, useEffect, useState } from 'react';
import { FeedbackCampaignProps } from './type';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useAppDispatch } from '@/app/store';
import { likeFeedbackApiThunk, unlikeFeedbackApiThunk } from '@/services/campaign/feedback/feedbackCampaignThunk';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { FeedbackLike } from '@/types/campaign';

dayjs.locale('vi');
dayjs.extend(relativeTime);

const FeedbackCampaign: FC<FeedbackCampaignProps> = ({ feedback, user }) => {
    const dispatch = useAppDispatch();
    const [isLiked, setIsLiked] = useState<boolean>(false); // Local state for like

    useEffect(() => {
        // Check if the current feedback is liked by the user
        const liked = feedback.likes?.some((like: FeedbackLike) => like.accountId === user?.accountId);
        setIsLiked(liked);
    }, [feedback, user]);

    const handleFavoriteCampaign = async () => {
        try {
            if (isLiked) {
                const like = feedback.likes?.find((like: FeedbackLike) => like.feedBackLikeId);
                if (like?.feedBackLikeId) {
                    await dispatch(unlikeFeedbackApiThunk(String(like.feedBackLikeId))).unwrap();
                } else {
                    toast.error("Không tìm thấy lượt thích để huỷ.");
                    return;
                }
            } else {
                const likePayload = {
                    campaignFeedbackId: String(feedback.feedBackId),
                    replyCampaignFeedbackId: null,
                };
                await dispatch(likeFeedbackApiThunk(likePayload)).unwrap();
            }

            setIsLiked(!isLiked);
        } catch {
            toast.error("Có lỗi xảy ra.");
        }
    };

    return (
        <div className="feedback-item">
            <h4 className='ft-name'>{feedback.fullName}</h4>
            <p className='ft-content'>{feedback.content}</p>
            <div className="ft-info">
                <p className="ft-time">{feedback?.dateCreated ? dayjs(feedback.dateCreated).fromNow() : ''}</p>
                <FarvoriteIcon
                    className={classNames('ft-favorite-icon', { 'ft-favorite-icon-active': isLiked })}
                    onClick={handleFavoriteCampaign}
                />
            </div>
        </div>
    );
};

export default FeedbackCampaign;
