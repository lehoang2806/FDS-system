import { selectGetPostById, selectIsAuthenticated } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { CameraIcon, CommentIcon, FarvoriteIcon, FavoriteIcon, SendIcon } from "@/assets/icons";
import { approvePostApiThunk, getAllPostsApiThunk, getPostByIdApiThunk, likePostApiThunk, unlikePostApiThunk } from "@/services/post/postThunk";
import { FC, useEffect, useRef, useState } from "react";
import { PostProps } from "./type";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import PostImageGallery from "./PostImageGallery";
import { toast } from "react-toastify";
import { setLoading } from "@/services/app/appSlice";
import { RejectPostModal } from "../Modal";
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

    const [isRejectPostModalOpen, setIsRejectPostModalOpen] = useState(false);
    const [selectedRejectPost, setSelectedRejectPost] = useState<RejectPost | null>(null);

    useEffect(() => {
        if (post) {
            dispatch(getPostByIdApiThunk(post.postId));
        }
    }, []);

    const handleApprovePost = async (values: ApprovePost) => {
        try {
            await dispatch(approvePostApiThunk(values)).unwrap();
            toast.success("Phê duyệt thành công");
            dispatch(setLoading(true));
            dispatch(getAllPostsApiThunk())
                .unwrap()
                .catch(() => {
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                });
        } catch (error) {
            console.error("Error in approval process:", error);
            toast.error("An error occurred while approving the certificate.");
        }
    };


    const handleRejectPost = (postId: string) => {
        setSelectedRejectPost({ postId, comment: "" });
        setIsRejectPostModalOpen(true);
    };

    const isFavoritePost = postDetail?.likes.some((like) => like.accountId === user?.accountId);

    const handleFavoritePost = async (postId: string) => {
        if (isFavoritePost) {
            dispatch(unlikePostApiThunk(postId))
                .unwrap()
                .then(() => {
                    dispatch(getPostByIdApiThunk(postId));
                })
                .catch(() => {
                    toast.error("Có lỗi xảy ra.");
                });
        } else {
            dispatch(likePostApiThunk(postId))
                .unwrap()
                .then(() => {
                    dispatch(getPostByIdApiThunk(postId));
                })
                .catch(() => {
                    toast.error("Có lỗi xãy ra.");
                });
        }
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

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
        postId: String(post?.postId),
        content: "",
    };

    const schema = Yup.object({
        content: Yup.string().required("Vui lòng nhập nội dung"),
    });

    const hanldeSendFeedback = (values: CommentPost, helpers: FormikHelpers<CommentPost>) => {
        dispatch(setLoading(true));
        dispatch(commentPostApiThunk(values))
            .unwrap()
            .then(() => {
                toast.success("Gửi nhận xét thành công");
                dispatch(getPostByIdApiThunk(String(post?.postId)));
                helpers.resetForm();
                setPreviewImages([]);
            })
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }

    const handleIsAuthencation = () => {
        if (isAuthentication === false) {
            alert('Vui lòng đăng nhập')
        }
    }

    return (
        <div className="post-container">
            <div className="pcr1">
                <div className="pcr1c2">
                    <h5 className="p-name">{post.posterName}{isStatus && (<span> - {post?.status === "Pending" ? <span className='status-pending'>Đang chờ phê duyệt</span> : post?.status === "Approved" ? <span className='status-approve'>Đã được phê duyệt</span> : <span className='status-reject'>Đã bị từ chối</span>}</span>)}</h5>
                    <p className="p-time">
                        {post.status === "Approved" ? (
                            <>
                                {postDetail?.publicDate ? dayjs(postDetail.publicDate).format('DD/MM/YYYY') : ''}
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

                {post.images.length > 0 && (
                    <PostImageGallery images={post.images} />
                )}
            </div>
            <hr />
            {post.status === "Approved" && (
                <>
                    <div className="pcr3">
                        <div className="pcr3c1">
                            <FarvoriteIcon
                                onClick={() => { handleFavoritePost(post.postId); handleIsAuthencation() }}
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
                            {({
                                handleSubmit,
                                setFieldValue,
                            }) => (
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
                                                // ref={fileInputRef}
                                                multiple
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange(e, setFieldValue)}
                                            />


                                            {/* Camera Icon */}
                                            <CameraIcon className='camera-icon' onClick={handleCameraClick} />
                                            <button className="btn-comment" onClick={handleIsAuthencation} type="submit"><SendIcon className="btn-icon" /></button>
                                        </div>
                                    </div>
                                    <div className="preview-images-container" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                        {postDetail?.comments && postDetail?.comments?.length > 0 && (
                            <>
                                {postDetail?.comments.map((item, index) => (
                                    <div key={index} className="feedback-item">
                                        <h4 className='ft-name'>{item.fullName}</h4>
                                        <p className='ft-content'>{item.content}</p>
                                        <div className="ft-info">
                                            <p className="ft-time">{item?.createdDate ? dayjs(item.createdDate).fromNow() : ''}</p>
                                            <FavoriteIcon className='ft-favorite-icon' />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}

            {user && (user.roleId === 1 || user.roleId === 2) && (
                <>
                    {post.status === "Approved" && (
                        <>
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
                            <div className="pcr4"></div>
                        </>
                    )}
                    {post.status === "Pending" && (
                        <div className="pcr3">
                            <button className="approve-btn" onClick={() => handleApprovePost({ postId: post.postId })}>Xét duyệt</button>
                            <button className="reject-btn" onClick={() => handleRejectPost(post.postId)}>Từ chối</button>
                        </div>
                    )}
                </>
            )}

            <RejectPostModal isOpen={isRejectPostModalOpen} setIsOpen={setIsRejectPostModalOpen} selectedRejectPost={selectedRejectPost} />
        </div>
    );
};

export default Post;
