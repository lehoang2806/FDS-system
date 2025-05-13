import { selectGetNewsById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { RichTextField } from "@/components/Elements";
import Button from "@/components/Elements/Button";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import {
    getNewsByIdApiThunk,
    updateNewsApiThunk,
} from "@/services/news/newsThunk";
import { formatDater } from "@/utils/helper";
import axios from "axios";
import classNames from "classnames";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { get } from "lodash";
import { FC, useEffect, useState } from "react";
import Lightbox from "react-awesome-lightbox";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const StaffUpdateNewsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const currentNews = useAppSelector(selectGetNewsById);

    const [imagePreview, setImagePreview] = useState<string[]>([]); //state
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const CLOUDINARY_URL =
        "https://api.cloudinary.com/v1_1/dehc2ftiv/image/upload";
    const UPLOAD_PRESET = "fds_system";

    const initialValues: ActionParamNews = {
        newsTitle: currentNews?.newsTitle || "",
        images: currentNews?.images || [],
        newsDescripttion: currentNews?.newsDescripttion || "",
        supportBeneficiaries: currentNews?.supportBeneficiaries || "",
    };

    const schema = Yup.object().shape({
        newsTitle: Yup.string()
            .required("Tiêu đề không được để trống")
            .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
            .max(100, "Tiêu đề không được vượt quá 100 ký tự"),

        images: Yup.array()
            .of(Yup.string().required("Mỗi ảnh phải là một chuỗi hợp lệ"))
            .min(1, "Cần ít nhất một ảnh")
            .required("Danh sách ảnh là bắt buộc"),

        newsDescripttion: Yup.string()
            .required("Nội dung không được để trống")
            .min(10, "Nội dung phải có ít nhất 10 ký tự"),

        supportBeneficiaries: Yup.string().required(
            "Đối tượng hỗ trợ không được để trống"
        ),
    });

    useEffect(() => {
        if (!currentNews || currentNews.newId !== id) {
            dispatch(setLoading(true));
            dispatch(getNewsByIdApiThunk(String(id)))
                .unwrap()
                .catch(() => {
                    toast.error("Không tìm thấy tin tức");
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000);
                });
        }
    }, [dispatch, id, currentNews]);

    useEffect(() => {
        if (currentNews?.images?.length) {
            setImagePreview(currentNews.images);
        } else {
            setImagePreview([]);
        }
    }, [currentNews]);

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: Function,
        setImagePreview: Function
    ) => {
        const files = Array.from(e.target.files || []);
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setImagePreview(previewUrls); // Hiển thị preview ảnh

        try {
            const uploadedUrls = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", UPLOAD_PRESET);

                    const res = await axios.post(CLOUDINARY_URL, formData);
                    return res.data.secure_url;
                })
            );

            setFieldValue("images", uploadedUrls); // Lưu URL ảnh thực tế vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

    const moderateContentAI = async (
        content: string
    ): Promise<{ isApproved: boolean; reason?: string }> => {
        const bannedKeywords = ["cấm", "vi phạm", "chửi", "giết", "xxx"]; // Thêm từ cấm vào đây
        const lowerContent = content.toLowerCase();

        // Kiểm tra nếu nội dung chứa từ cấm
        if (bannedKeywords.some((keyword) => lowerContent.includes(keyword))) {
            return { isApproved: false, reason: "Nội dung chứa từ bị cấm" };
        }

        return { isApproved: true }; // Nếu không có từ cấm, phê duyệt bài viết
    };

    const onSubmit = async (
        values: ActionParamNews,
        helpers: FormikHelpers<ActionParamNews>
    ) => {
        const { newsTitle, newsDescripttion } = values;

        // Kiểm duyệt tiêu đề
        const titleCheck = await moderateContentAI(newsTitle);
        if (!titleCheck.isApproved) {
            toast.error(`Tiêu đề không hợp lệ vì chứa từ vi phạm`);
            helpers.setSubmitting(false);
            return;
        }

        // Kiểm duyệt mô tả
        const descCheck = await moderateContentAI(newsDescripttion);
        if (!descCheck.isApproved) {
            toast.error(`Mô tả không hợp lệ vì chứa từ vi phạm`);
            helpers.setSubmitting(false);
            return;
        }

        // Gửi nếu không có từ cấm
        await dispatch(
            updateNewsApiThunk({
                newsId: String(id),
                params: values,
            })
        )
            .unwrap()
            .then(() => {
                toast.success("Cập nhật tin tức thành công");
                helpers.resetForm();
                setImagePreview([]);
                navigateHook(routes.staff.news.detail.replace(":id", String(id)));
            })
            .catch((error) => {
                const errorData = get(error, "data", null);
                toast.error(errorData || "Đã xảy ra lỗi");
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={schema}
            enableReinitialize={true}
        >
            {({
                handleSubmit,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
            }) => (
                <Form onSubmit={handleSubmit}>
                    <section id="staff-add-news" className="staff-section">
                        <div className="staff-container san-container">
                            <div className="sancr1">
                                <h1>Tin tức</h1>
                                <p>
                                    Dashboard
                                    <span className="staff-tag">
                                        Cập nhật tin tức
                                    </span>
                                </p>
                            </div>
                            <div className="sancr2">
                                <div className="sancr2r1">
                                    <h2></h2>
                                    <div className="group-btn">
                                        <button
                                            onClick={() =>
                                                navigateHook(
                                                    routes.staff.news.detail.replace(
                                                        ":id",
                                                        String(id)
                                                    )
                                                )
                                            }
                                        >
                                            Hủy
                                        </button>
                                        <Button
                                            type="submit"
                                            title="Cập nhật tin tức"
                                            loading={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="sancr2r2">
                                    <div className="sancr2r2c1"></div>
                                    <div className="sancr2r2c2">
                                        <h3>Ngày tạo:</h3>
                                        <p>
                                            {formatDater(
                                                String(currentNews?.createdDate)
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <hr />
                                <div className="sancr2r3">
                                    <div className="form">
                                        <div className="form-50 form-field">
                                            <label className="form-label">
                                                Tiêu đề <span>*</span>
                                            </label>
                                            <Field
                                                name="newsTitle"
                                                type="text"
                                                placeholder="Hãy nhập tiêu đề"
                                                className={classNames(
                                                    "form-input",
                                                    {
                                                        "is-error":
                                                            errors.newsTitle &&
                                                            touched.newsTitle,
                                                    }
                                                )}
                                            />
                                            {errors.newsTitle &&
                                                touched.newsTitle && (
                                                    <span className="text-error">
                                                        {errors.newsTitle}
                                                    </span>
                                                )}
                                        </div>
                                        <div className="form-50 form-field">
                                            <label className="form-label">
                                                Đối tượng hỗ trợ<span>*</span>
                                            </label>
                                            <Field
                                                name="supportBeneficiaries"
                                                type="text"
                                                placeholder="Hãy nhập đối tượng hỗ trợ"
                                                className={classNames(
                                                    "form-input",
                                                    {
                                                        "is-error":
                                                            errors.supportBeneficiaries &&
                                                            touched.supportBeneficiaries,
                                                    }
                                                )}
                                            />
                                            {errors.supportBeneficiaries &&
                                                touched.supportBeneficiaries && (
                                                    <span className="text-error">
                                                        {
                                                            errors.supportBeneficiaries
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                        <div className="form-100 form-field">
                                            <label className="form-label">
                                                Mô tả<span>*</span>
                                            </label>
                                            <RichTextField
                                                name="newsDescripttion"
                                                placeholder="Hãy nhập mô tả của tin tức"
                                            />
                                            {errors.newsDescripttion &&
                                                touched.newsDescripttion && (
                                                    <span className="text-error">
                                                        {
                                                            errors.newsDescripttion
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                        <div className="form-100 form-field">
                                            <label className="form-label">
                                                Hình Ảnh<span>*</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        setFieldValue,
                                                        setImagePreview
                                                    )
                                                }
                                                className={classNames(
                                                    "form-input",
                                                    {
                                                        "is-error":
                                                            errors.images &&
                                                            touched.images,
                                                    }
                                                )}
                                            />
                                            {errors.images &&
                                                touched.images && (
                                                    <span className="text-error">
                                                        {errors.images}
                                                    </span>
                                                )}
                                        </div>

                                        {imagePreview.length > 0 && (
                                            <div className="image-preview-container">
                                                {imagePreview.map(
                                                    (img, index) => (
                                                        <div
                                                            key={index}
                                                            className="image-wrapper"
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`Preview ${index}`}
                                                                className="image-preview"
                                                                style={{
                                                                    width: "100px",
                                                                    height: "100px",
                                                                    marginRight:
                                                                        "8px",
                                                                    borderRadius:
                                                                        "5px",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() =>
                                                                    setLightboxIndex(
                                                                        index
                                                                    )
                                                                } // mở lightbox khi click ảnh
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {lightboxIndex !== null && (
                                            <Lightbox
                                                images={imagePreview.map(
                                                    (src) => ({ url: src })
                                                )}
                                                startIndex={lightboxIndex}
                                                onClose={() =>
                                                    setLightboxIndex(null)
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Form>
            )}
        </Formik>
    );
};

export default StaffUpdateNewsPage;
