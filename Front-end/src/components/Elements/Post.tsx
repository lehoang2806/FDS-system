import { selectGetPostById, selectIsAuthenticated } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { CameraIcon, CommentIcon, FarvoriteIcon, FavoriteIcon, SendIcon } from "@/assets/icons";
import { approvePostApiThunk, getAllPostsApiThunk, getPostByIdApiThunk, likePostApiThunk, rejectPostApiThunk, unlikePostApiThunk } from "@/services/post/postThunk";
import { FC, useEffect, useRef, useState } from "react";
import { PostProps } from "./type";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import PostImageGallery from "./PostImageGallery";
import { toast } from "react-toastify";
import { setLoading } from "@/services/app/appSlice";
import classNames from "classnames";
import Lightbox from "react-awesome-lightbox";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { commentPostApiThunk } from "@/services/post/comment/commentPostThunk";

dayjs.locale('vi');
dayjs.extend(relativeTime);

const Post: FC<PostProps> = ({ post, user, isStatus = false }) => {
    const dispatch = useAppDispatch();
    const postDetail = useAppSelector(selectGetPostById);
    const isAuthentication = useAppSelector(selectIsAuthenticated);

    const moderateContentAI = async (content: string): Promise<{ isApproved: boolean; reason?: string }> => {
        const bannedKeywords = ["cấm", "vi phạm", "chửi", "giết", "xxx"]; // Thêm từ cấm vào đây
        const lowerContent = content.toLowerCase();

        // Kiểm tra nếu nội dung chứa từ cấm
        if (bannedKeywords.some(keyword => lowerContent.includes(keyword))) {
            return { isApproved: false, reason: "Nội dung chứa từ bị cấm" };
        }

        return { isApproved: true }; // Nếu không có từ cấm, phê duyệt bài viết
    };

    useEffect(() => {
        if (post) {
            dispatch(getPostByIdApiThunk(post.postId));
        }
    }, [post]);

    const handleApprovePost = async (values: ApprovePost) => {
        try {
            await dispatch(approvePostApiThunk(values)).unwrap();
            toast.success("Phê duyệt thành công");
            dispatch(getAllPostsApiThunk());
        } catch (error) {
            toast.error("Có lỗi xảy ra khi phê duyệt bài viết.");
        }
    };

    const handleRejectPost = async (values: RejectPost) => {
        try {
            await dispatch(rejectPostApiThunk(values)).unwrap();
            toast.success("Đã từ chối");
            dispatch(getAllPostsApiThunk());
        } catch (error) {
            toast.error("Có lỗi xảy ra khi từ chối bài viết.");
        }
    };

    useEffect(() => {
        const handleAutoModeratePendingPosts = async () => {
            if (post?.status === "Pending") {
                const result = await moderateContentAI(post.postContent);

                if (result.isApproved) {
                    // Phê duyệt bài viết nếu nội dung không vi phạm
                    handleApprovePost({ postId: post.postId });
                    toast.success("Bài viết đã được phê duyệt tự động.");
                } else {
                    // Từ chối bài viết nếu có vi phạm nội dung
                    handleRejectPost({
                        postId: post.postId,
                        comment: result.reason || "Nội dung không phù hợp"
                    });
                }
            }
        };

        handleAutoModeratePendingPosts();
    }, [post]);

    useEffect(() => {
        if (post) {
            dispatch(getPostByIdApiThunk(post.postId));
        }
    }, [post]);

    const isFavoritePost = Array.isArray(post.likes) && post.likes.some((like) => like.accountId === user?.accountId);

    const handleFavoritePost = async (postId: string, postLikeId?: string) => {
        if (postLikeId) {
            dispatch(unlikePostApiThunk(postLikeId)).unwrap()
                .then(() => {
                    dispatch(getPostByIdApiThunk(postId));
                    dispatch(getAllPostsApiThunk());
                })
                .catch(() => toast.error("Có lỗi xảy ra."));
        } else {
            dispatch(likePostApiThunk(postId)).unwrap()
                .then(() => {
                    dispatch(getPostByIdApiThunk(postId));
                    dispatch(getAllPostsApiThunk());
                })
                .catch(() => toast.error("Có lỗi xảy ra."));
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleCameraClick = () => fileInputRef.current?.click();

    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const readers = Array.from(files).map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then((base64Images) => {
                setPreviewImages(base64Images);
                setFieldValue("images", base64Images);
            });
        }
    };

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setPhotoIndex(index);
        setIsLightboxOpen(true);
    };

    const initialValues: CommentPost = {
        postCommentId: null,
        postId: String(post?.postId),
        content: "",
        images: [],
    };

    const schema = Yup.object({
        content: Yup.string().required("Vui lòng nhập nội dung"),
    });

    const hanldeSendFeedback = async (values: CommentPost, helpers: FormikHelpers<CommentPost>) => {
        try {
            dispatch(setLoading(true));
            await dispatch(commentPostApiThunk(values)).unwrap();
            toast.success("Gửi nhận xét thành công");
            dispatch(getPostByIdApiThunk(String(post?.postId)));
            helpers.resetForm();
            setPreviewImages([]);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi gửi nhận xét.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleIsAuthencation = () => {
        if (isAuthentication === false) {
            alert('Vui lòng đăng nhập')
        }
    };

    return (
        <div className="post-container">
            <div className="pcr1">
                <div className="pcr1c2">
                    <h5 className="p-name">
                        {post.posterName}
                        {isStatus && post?.status && (
                            <span>
                                - {post?.status === "Pending" ? (
                                    <span className='status-pending'>Đang chờ phê duyệt</span>
                                ) : post?.status === "Approved" ? (
                                    <span className='status-approve'>Đã được phê duyệt</span>
                                ) : (
                                    <span className='status-reject'>Đã bị từ chối</span>
                                )}
                            </span>
                        )}
                    </h5>
                    <p className="p-time">
                        {post.status === "Approved" ? (
                            <>
                                {post?.publicDate ? dayjs(post.publicDate).fromNow() : ''}
                            </>
                        ) : (
                            <>
                                {postDetail?.createdDate ? dayjs(postDetail.createdDate).fromNow() : ''}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="pcr2">
                <div className="pcr2-content">{post.postContent}</div>
                {post.images.length > 0 && <PostImageGallery images={post.images} />}
            </div>
            <hr />
            {post.status === "Approved" && (
                <>
                    <div className="pcr3">
                        <div className="pcr3c1">
                            <FarvoriteIcon
                                onClick={() => handleFavoritePost(post.postId, post.likes.find(like => like.accountId === user?.accountId)?.postLikeId)}
                                className={classNames("pcr3-icon", isFavoritePost ? "pcr3-icon-active" : "")}
                            />
                            <CommentIcon className="pcr3-icon" />
                        </div>
                        <div className="pcr3c2">
                            <p>{postDetail?.likes.length} lượt thích</p>
                            <div className="dot"></div>
                            <p>{postDetail?.comments.length} bình luận</p>
                        </div>
                    </div>
                    <hr />
                    <div className="pcr4">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={hanldeSendFeedback}
                            validationSchema={schema}
                        >
                            {({ handleSubmit, setFieldValue }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className="input-comment-container">
                                        <Field
                                            as="textarea"
                                            name="content"
                                            rows={1}
                                            className="input-comment"
                                            placeholder="Thêm bình luận"
                                        />
                                        <div className="iccr2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                multiple
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange(e, setFieldValue)}
                                            />
                                            <CameraIcon className='camera-icon' onClick={handleCameraClick} />
                                            <button className="btn-comment" onClick={handleIsAuthencation} type="submit"><SendIcon className="btn-icon" /></button>
                                        </div>
                                    </div>
                                    <div className="preview-images-container" style={{ display: "flex", marginTop: "20px", gap: "10px", flexWrap: "wrap" }}>
                                        {previewImages.map((img, idx) => (
                                            <div key={idx} style={{ position: "relative" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = previewImages.filter((_, i) => i !== idx);
                                                        setPreviewImages(newImages);
                                                        setFieldValue("images", newImages);
                                                    }}
                                                    style={{
                                                        position: "absolute",
                                                        top: "-8px",
                                                        right: "-8px",
                                                        background: "red",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "50%",
                                                        width: "20px",
                                                        height: "20px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    X
                                                </button>
                                                <img
                                                    src={img}
                                                    alt={`Preview ${idx}`}
                                                    onClick={() => openLightbox(idx)}
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        objectFit: "cover",
                                                        borderRadius: "6px",
                                                        cursor: "pointer"
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {isLightboxOpen && photoIndex !== null && (
                                        <Lightbox
                                            images={previewImages.map((src) => ({ url: src }))}
                                            startIndex={photoIndex}
                                            onClose={() => {
                                                setIsLightboxOpen(false);
                                                setPhotoIndex(null);
                                            }}
                                        />
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="pcr5">
                        {postDetail?.comments && postDetail.comments.length > 0 ? (
                            postDetail.comments.map((item, index) => (
                                <div key={item.postCommentId || index} className="feedback-item">
                                    <h4 className="ft-name">{item.fullName}</h4>
                                    <p className="ft-content">{item.content}</p>
                                    <div className="ft-info">
                                        <p className="ft-time">
                                            {item?.createdDate ? dayjs(item.createdDate).fromNow() : ""}
                                        </p>
                                        <FavoriteIcon className="ft-favorite-icon" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có bình luận</p>
                        )}
                    </div>

                </>
            )}
            {postDetail && postDetail.status === "Rejected" && (
                <div className="pcr5">
                    <div className="feedback-item">
                        <h3>Lý do bị từ chối</h3>
                        <p className="ft-content">
                            {postDetail.rejectComment || "Không có lý do"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
