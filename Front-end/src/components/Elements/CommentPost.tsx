import { FarvoriteIcon } from "@/assets/icons";
import { UserProfile } from "@/types/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/store";
import { toast } from "react-toastify";
import { getAllPostsApiThunk } from "@/services/post/postThunk";
import {
    likeCommentApiThunk,
    unlikeCommentApiThunk,
} from "@/services/post/comment/commentPostThunk";
import classNames from "classnames";

dayjs.locale("vi");
dayjs.extend(relativeTime);

interface CommentPostProps {
    comment: PostComment;
    user: UserProfile;
}
const CommentPost = ({ comment, user }: CommentPostProps) => {
    const dispatch = useAppDispatch();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeId, setLikeId] = useState<string | null>(null);

    useEffect(() => {
        const userLike = comment.likes?.find(
            (like: any) => like.accountId === user?.accountId
        );
        setIsLiked(!!userLike);
        setLikeId(userLike?.postCommentLikeId || null);
    }, [comment, user]);

    const handleFavoriteComment = async () => {
        try {
            if (isLiked && likeId) {
                await dispatch(unlikeCommentApiThunk(likeId)).unwrap();
                toast.success("Đã huỷ thích bình luận này.");
            } else {
                const likePayload = {
                    postCommentId: String(comment.postCommentId),
                    replyPostCommentId: null,
                };
                await dispatch(likeCommentApiThunk(likePayload)).unwrap();
                toast.success("Đã thích bình luận này.");
            }
    
            dispatch(getAllPostsApiThunk());
        } catch {
            toast.error("Có lỗi xảy ra khi xử lý yêu thích.");
        }
    };

    return (
        <div className="feedback-item">
            <h4 className="ft-name">{comment.fullName}</h4>
            <p className="ft-content">{comment.content}</p>
            <div className="ft-info">
                <p className="ft-time">
                    {comment?.createdDate
                        ? dayjs(comment.createdDate).fromNow()
                        : ""}
                </p>
                <FarvoriteIcon
                    className={classNames("ft-favorite-icon", {
                        "ft-favorite-icon-active": isLiked,
                    })}
                    onClick={handleFavoriteComment}
                />
            </div>
        </div>
    );
};

export default CommentPost;
