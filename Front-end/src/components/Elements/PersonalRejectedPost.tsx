import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { FC  } from 'react';
import { PersonalRejectedPostProps } from './type';
import PostImageGallery from './PostImageGallery';

dayjs.locale('vi');
dayjs.extend(relativeTime);

const PersonalRejectedPost: FC<PersonalRejectedPostProps> = ({ post }) => {

    return (
        <div className="post-container">
            <div className="pcr1">
                <div className="pcr1c2">
                    <h5 className="p-name">
                        {post.posterName} - <span className='status-reject'>Đã bị từu chối</span>
                    </h5>
                    <p className="p-time">
                        {post?.publicDate ? dayjs(post.publicDate).fromNow() : ''}
                    </p>
                </div>
            </div>

            <div className="pcr2">
                <div className="pcr2-content">{post.postContent}</div>
                {post.images.length > 0 && <PostImageGallery images={post.images} />}
            </div>
            <div className="pcr5">
                    <div className="feedback-item">
                        <h3>Lý do bị từ chối</h3>
                        <p className="ft-content">
                            {post.rejectComment}
                        </p>
                    </div>
                </div>
        </div>
    )
}

export default PersonalRejectedPost