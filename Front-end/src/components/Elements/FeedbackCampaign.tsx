import { FarvoriteIcon } from '@/assets/icons'
import { FC, useEffect } from 'react'
import { FeedbackCampaignProps } from './type'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectGetFeedbackDetail } from '@/app/selector';
import { getFeedbackDetailApiThunk, likeFeedbackApiThunk, unlikeFeedbackApiThunk } from '@/services/campaign/feedback/feedbackCampaignThunk';
import { toast } from 'react-toastify';
import classNames from 'classnames';

dayjs.locale('vi');
dayjs.extend(relativeTime);

const FeedbackCampaign: FC<FeedbackCampaignProps> = ({ feedback, user }) => {
    const dispatch = useAppDispatch();
    const feedbackDetail = useAppSelector(selectGetFeedbackDetail)

    useEffect(() => {
        if (!feedbackDetail) {
            dispatch(getFeedbackDetailApiThunk(String(feedback.feedBackId)));
        }
    }, [dispatch, feedback.feedBackId, feedbackDetail]);

    const isFavoriteFeedback = feedbackDetail?.likes?.some((like) => like.accountId === user?.accountId);

    const handleFavoriteCampaign = async (postId: string) => {
        const action = isFavoriteFeedback ? unlikeFeedbackApiThunk : likeFeedbackApiThunk;
        try {
            await dispatch(action(postId)).unwrap();
            dispatch(getFeedbackDetailApiThunk(String(postId)));
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
                <FarvoriteIcon className={classNames('ft-favorite-icon', { 'ft-favorite-icon-active': isFavoriteFeedback })} onClick={() => handleFavoriteCampaign(String(feedback?.feedBackId))} />
            </div>
        </div>
    )
}

export default FeedbackCampaign