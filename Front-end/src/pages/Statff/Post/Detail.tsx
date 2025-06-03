import { selectGetAllPosts, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import {
    deletePostApiThunk,
    getAllPostsApiThunk,
    getPostByIdApiThunk,
    likePostApiThunk,
    unlikePostApiThunk,
} from "@/services/post/postThunk";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { commentPostApiThunk } from "@/services/post/comment/commentPostThunk";
import {
    CameraIcon,
    CommentIcon,
    FarvoriteIcon,
    FavoriteIcon,
    SendIcon,
} from "@/assets/icons";
import Lightbox from "react-awesome-lightbox";
import classNames from "classnames";
import { PostContent, PostImageGallery } from "@/components/Elements";
import { Modal } from "@/components/Modal";

dayjs.locale("vi");
dayjs.extend(relativeTime);

const StaffDetailPostPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);

    const posts = useAppSelector(selectGetAllPosts);
    const post = posts.find((post) => post.postId === id);
    const userLogin = useAppSelector(selectUserLogin);

    console.log(post);

    useEffect(() => {
        dispatch(setLoading(true));
        Promise.all([dispatch(getAllPostsApiThunk()).unwrap()])
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);

    const isFavoritePost =
        Array.isArray(post?.likes) &&
        post?.likes.some((like) => like.accountId === userLogin?.accountId);

    const handleFavoritePost = async (postId: string, postLikeId?: string) => {
        if (postLikeId) {
            dispatch(unlikePostApiThunk(postLikeId))
                .unwrap()
                .then(() => {
                    dispatch(getPostByIdApiThunk(postId));
                    dispatch(getAllPostsApiThunk());
                })
                .catch(() => toast.error("Có lỗi xảy ra."));
        } else {
            dispatch(likePostApiThunk(postId))
                .unwrap()
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

    const hanldeSendFeedback = async (
        values: CommentPost,
        helpers: FormikHelpers<CommentPost>
    ) => {
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

    const handleDeletePost = async () => {
        dispatch(setLoading(true));
        dispatch(deletePostApiThunk(String(id)))
            .unwrap()
            .then(() => {
                navigateHook(routes.staff.news.list);
                toast.success("Xóa tin tức thành công");
                dispatch(getAllPostsApiThunk());
            })
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    };

    return (
        <section id="staff-detail-post" className="staff-section">
            <div className="staff-container sdp-container">
                <div className="sdpcr1">
                    <h1>Bài viết</h1>
                    <p>
                        Trang tổng quát
                        <span className="staff-tag">Chi tiết bài viết</span>
                    </p>
                </div>
                <div className="sdpcr2">
                    <button onClick={() => setShowModalConfirm(true)}>
                        Xoá
                    </button>
                    <button
                        onClick={() => navigateHook(routes.staff.post.list)}
                    >
                        Quay lại danh sách
                    </button>
                </div>
                <div className="sdpcr3">
                    <div className="post-container">
                        <div className="pcr1">
                            <div className="pcr1c2">
                                <h5 className="p-name">{post?.posterName}</h5>
                                <p className="p-time">
                                    {post?.publicDate
                                        ? dayjs(post.publicDate).fromNow()
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <div className="pcr2">
                            {post?.articleTitle && <h4>{post?.articleTitle}</h4>}
                            <PostContent content={String(post?.postContent)} />
                            {post?.hashtags && post.hashtags.length > 0 && (
                                <div
                                    style={{
                                        paddingLeft: "20px",
                                        display: "flex",
                                        gap: "10px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {post?.hashtags.map((hashtag, index) => (
                                        <p className="p-hashtag" key={index}>
                                            #{hashtag}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {(post?.images || []).length > 0 && (
                                <PostImageGallery images={post?.images || []} />
                            )}
                        </div>
                        <hr />
                        <div className="pcr3">
                            <div className="pcr3c1">
                                <FarvoriteIcon
                                    onClick={() =>
                                        handleFavoritePost(
                                            String(post?.postId),
                                            post?.likes.find(
                                                (like) =>
                                                    like.accountId ===
                                                    userLogin?.accountId
                                            )?.postLikeId
                                        )
                                    }
                                    className={classNames(
                                        "pcr3-icon",
                                        isFavoritePost ? "pcr3-icon-active" : ""
                                    )}
                                />
                                <CommentIcon className="pcr3-icon" />
                            </div>
                            <div className="pcr3c2">
                                <p>{post?.likes.length} lượt thích</p>
                                <div className="dot"></div>
                                <p>{post?.comments.length} bình luận</p>
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
                                                    style={{ display: "none" }}
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e,
                                                            setFieldValue
                                                        )
                                                    }
                                                />
                                                <CameraIcon
                                                    className="camera-icon"
                                                    onClick={handleCameraClick}
                                                />
                                                <button
                                                    className="btn-comment"
                                                    type="submit"
                                                >
                                                    <SendIcon className="btn-icon" />
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className="preview-images-container"
                                            style={{
                                                display: "flex",
                                                marginTop: "20px",
                                                gap: "10px",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {previewImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        position: "relative",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages =
                                                                previewImages.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        idx
                                                                );
                                                            setPreviewImages(
                                                                newImages
                                                            );
                                                            setFieldValue(
                                                                "images",
                                                                newImages
                                                            );
                                                        }}
                                                        style={{
                                                            position:
                                                                "absolute",
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
                                                        onClick={() =>
                                                            openLightbox(idx)
                                                        }
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            objectFit: "cover",
                                                            borderRadius: "6px",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {isLightboxOpen &&
                                            photoIndex !== null && (
                                                <Lightbox
                                                    images={previewImages.map(
                                                        (src) => ({
                                                            url: src,
                                                        })
                                                    )}
                                                    startIndex={photoIndex}
                                                    onClose={() => {
                                                        setIsLightboxOpen(
                                                            false
                                                        );
                                                        setPhotoIndex(null);
                                                    }}
                                                />
                                            )}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="pcr5">
                            {post?.comments && post.comments.length > 0 ? (
                                post.comments.map((item, index) => (
                                    <div
                                        key={item.postCommentId || index}
                                        className="feedback-item"
                                    >
                                        <h4 className="ft-name">
                                            {item.fullName}
                                        </h4>
                                        <p className="ft-content">
                                            {item.content}
                                        </p>
                                        <div className="ft-info">
                                            <p className="ft-time">
                                                {item?.createdDate
                                                    ? dayjs(
                                                          item.createdDate
                                                      ).fromNow()
                                                    : ""}
                                            </p>
                                            <FavoriteIcon className="ft-favorite-icon" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="feedback-item">
                                    <p>Không có bình luận</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={showModalConfirm} setIsOpen={setShowModalConfirm}>
                <div className="confirm-delete-container">
                    <h1>Bạn có chắc chắn muốn xoá bài viết này không?</h1>
                    <div className="group-btn">
                        <button onClick={() => handleDeletePost()}>
                            Chắc chắn
                        </button>
                        <button onClick={() => setShowModalConfirm(false)}>
                            Huỷ
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default StaffDetailPostPage;
