import { FC, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { selectUserLogin } from '@/app/selector';
import { CreatePostModalProps } from './type';
import Modal from './Modal';
import Button from '../Elements/Button';
import { setLoading } from '@/services/app/appSlice';
import { approvePostApiThunk, createPostApiThunk, getAllPostsApiThunk, rejectPostApiThunk } from '@/services/post/postThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { RichTextField } from '../Elements';
import axios from 'axios';
import classNames from 'classnames';
import Lightbox from 'react-awesome-lightbox';

const CreatePostModal: FC<CreatePostModalProps> = ({ isOpen, setIsOpen }) => {
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dehc2ftiv/image/upload';
    const UPLOAD_PRESET = 'fds_system';

    const userLogin = useAppSelector(selectUserLogin)
    const dispatch = useAppDispatch()

    const initialValues: ActionParamPost = {
        postContent: "",
        images: [],
        posterName: userLogin?.fullName,
        hashtags: [""]
    };

    const CreatePostModalSchema = Yup.object().shape({
        postContent: Yup.string().required('Nội dung không được để trống').min(10, 'Nội dung phải có ít nhất 10 ký tự'),
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: Function, setImagePreview: Function) => {
        const files = Array.from(e.target.files || []);
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setImagePreview(previewUrls); // Hiển thị preview ảnh

        try {
            const uploadedUrls = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', UPLOAD_PRESET);

                    const res = await axios.post(CLOUDINARY_URL, formData);
                    return res.data.secure_url;
                })
            );

            setFieldValue("images", uploadedUrls); // Lưu URL ảnh thực tế vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

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

    const moderateContentAI = async (content: string): Promise<{ isApproved: boolean; reason?: string }> => {
        const bannedKeywords = ["cấm", "vi phạm", "chửi", "giết", "xxx"]; // Thêm từ cấm vào đây
        const lowerContent = content.toLowerCase();

        // Kiểm tra nếu nội dung chứa từ cấm
        if (bannedKeywords.some(keyword => lowerContent.includes(keyword))) {
            return { isApproved: false, reason: "Nội dung chứa từ bị cấm" };
        }

        return { isApproved: true }; // Nếu không có từ cấm, phê duyệt bài viết
    };

    const onSubmit = async (values: ActionParamPost, helpers: FormikHelpers<ActionParamPost>) => {
        dispatch(setLoading(true));
        try {
            const result = await dispatch(createPostApiThunk(values)).unwrap();

            helpers.resetForm();
            setImagePreview([]);
            toast.info("Bài viết của bạn đang chờ được phê duyệt");

            const aiResult = await moderateContentAI(String(values.postContent));

            if (aiResult.isApproved) {
                await handleApprovePost({ postId: result.postId }); // Approved nếu nội dung OK
            } else {
                await handleRejectPost({ postId: result.postId, comment: aiResult.reason || "Nội dung không phù hợp" }); // Reject nếu vi phạm
            }

            dispatch(getAllPostsApiThunk());
        } catch (error) {
            const errorData = get(error, "data.message", "An error occurred");
            toast.error(errorData);
        } finally {
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000);
            setIsOpen(false);
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Tạo bài viết">
            <section id="create-post-modal">
                <div className="cpm-container">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={CreatePostModalSchema}
                        onSubmit={onSubmit}
                    >
                        {({ setFieldValue, errors, touched, isSubmitting, values }) => (
                            <Form className="form">
                                <div className="form-field">
                                    <label className="form-label" style={{ marginBottom: "8px" }}>Nhập nội dung bài viết</label>
                                    <RichTextField name="postContent" placeholder="Nội dung bài viết" />
                                    {errors.postContent && touched.postContent && <span className="text-error">{errors.postContent}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Hashtags</label>
                                    {values.hashtags.map((tag, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                name={`hashtags[${index}]`}
                                                value={tag}
                                                onChange={(e) => {
                                                    const updatedTags = [...values.hashtags];
                                                    updatedTags[index] = e.target.value;
                                                    setFieldValue("hashtags", updatedTags);
                                                }}
                                                placeholder={`Hashtag ${index + 1}`}
                                                className="form-input w-full"
                                            />
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        title="Thêm hashtag"
                                        onClick={() => setFieldValue("hashtags", [...values.hashtags, ""])}
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Tải ảnh lên<span>*</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, setFieldValue, setImagePreview)}
                                        className={classNames("form-input", { "is-error": errors.images && touched.images })}
                                    />
                                    {errors.images && touched.images && <span className="text-error">{errors.images}</span>}
                                </div>

                                {/* Hiển thị ảnh preview */}
                                {imagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {imagePreview.map((img, index) => (
                                            <div key={index} className="image-wrapper">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index}`}
                                                    className="image-preview"
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        marginRight: '8px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setLightboxIndex(index)} // mở lightbox khi click ảnh
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Hiển thị lightbox khi click vào ảnh preview */}
                                {lightboxIndex !== null && (
                                    <Lightbox
                                        images={imagePreview.map((src) => ({ url: src }))}
                                        startIndex={lightboxIndex}
                                        onClose={() => setLightboxIndex(null)}
                                    />
                                )}

                                <Button type="submit" title="Đăng bài" loading={isSubmitting} />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    );
};

export default CreatePostModal;
