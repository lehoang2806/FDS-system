import { selectGetPostById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { CommentIcon, FarvoriteIcon } from "@/assets/icons";
import { getPostByIdApiThunk } from "@/services/post/postThunk";
import { FC, useEffect } from "react";
import { PostProps } from "./type";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import PostImageGallery from "./PostImageGallery";

dayjs.locale('vi');
dayjs.extend(relativeTime);

const Post: FC<PostProps> = ({ post, user }) => {
    const dispatch = useAppDispatch();
    const postDetail = useAppSelector(selectGetPostById);

    useEffect(() => {
        if (post) {
            dispatch(getPostByIdApiThunk(post.postId));
        }
    }, [post]);

    return (
        <div className="post-container">
            <div className="pcr1">
                <div className="pcr1c2">
                    <h5 className="p-name">{post.posterName}</h5>
                    <p className="p-time">
                        {postDetail?.createdDate ? dayjs(postDetail.createdDate).fromNow() : ''}
                    </p>
                </div>
            </div>

            <div className="pcr2">
                <div className="pcr2-content">{post.postContent}</div>

                {post.images.length > 0 && (
                    <PostImageGallery images={post.images} />
                )}
            </div>

            {(user.roleId === 3 || user.roleId === 4) && (
                <>
                    {post.status === "Approved" && (
                        <div className="pcr3">
                            <div className="pcr3c1">
                                <FarvoriteIcon className="pcr3-icon" />
                                <CommentIcon className="pcr3-icon" />
                            </div>
                            <div className="pcr3c2">
                                <p>0 lượt thích</p>
                                <div className="dot"></div>
                                <p>0 bình luận</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Post;
