import { ChangeEvent, FC, useState } from "react";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { PersonalDonor } from "@/types/user";
import * as Yup from "yup";
import Button from "../Elements/Button";
import classNames from "classnames";
import { createPersonalDonorCertificateApiThunk } from "@/services/user/userThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { PersonalDonorModalProps } from "./type";
import { setLoading } from "@/services/app/appSlice";
import { selectUserLogin } from "@/app/selector";
import Lightbox from "react-awesome-lightbox";
import axios from "axios";

const PersonalDonorModal: FC<PersonalDonorModalProps> = ({
    isOpen,
    setIsOpen,
}) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [othersImagePreview, setOthersImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [othersLightboxIndex, setOthersLightboxIndex] = useState<
        number | null
    >(null);
    const userLogin = useAppSelector(selectUserLogin);

    const CLOUDINARY_URL =
        "https://api.cloudinary.com/v1_1/dehc2ftiv/image/upload";
    const UPLOAD_PRESET = "fds_system";

    const initialValues: PersonalDonor = {
        fullName: userLogin?.fullName || "",
        birthDay: userLogin?.birthDay || "",
        email: userLogin?.email || "",
        phone: userLogin?.phone || "",
        address: userLogin?.address || "",
        socialMediaLink: "",
        mainSourceIncome: "",
        monthlyIncome: "",
        citizenImages: [],
        otherImages: [],
    };

    const schema = Yup.object().shape({
        fullName: Yup.string().required("Họ và tên không được để trống"),
        birthDay: Yup.date()
            .required("Ngày sinh không được để trống")
            .min(
                new Date(new Date().setFullYear(new Date().getFullYear() - 80)),
                "Bạn phải nhỏ hơn 80 tuổi"
            )
            .max(
                new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                "Bạn phải từ 18 tuổi trở lên"
            ),
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Email không được để trống"),
        phone: Yup.string()
            .matches(/^\d+$/, "Số điện thoại phải là số")
            .required("Số điện thoại không được để trống"),
        address: Yup.string().required("Địa chỉ không được để trống"),
        socialMediaLink: Yup.string().url("Liên kết mạng xã hội không hợp lệ"),
        monthlyIncome: Yup.string().test(
            "is-valid-number",
            "Thu nhập hàng tháng phải là số",
            (value) => {
                if (!value) return true; // allow empty
                const numeric = value.replace(/,/g, "");
                return !isNaN(Number(numeric));
            }
        ),
        citizenImages: Yup.array()
            .of(
                Yup.string()
                    .required("Mỗi ảnh phải là một chuỗi hợp lệ")
                    .matches(
                        /\.(jpeg|jpg|gif|png)$/,
                        "Ảnh phải có định dạng .jpeg, .jpg, .gif, hoặc .png"
                    )
            )
            .required("Danh sách ảnh là bắt buộc"),
        otherImages: Yup.array()
            .of(
                Yup.string()
                    .required("Mỗi ảnh phải là một chuỗi hợp lệ")
                    .matches(
                        /\.(jpeg|jpg|gif|png)$/,
                        "Ảnh phải có định dạng .jpeg, .jpg, .gif, hoặc .png"
                    )
            )
            .required("Danh sách ảnh là bắt buộc"),
    });

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

            setFieldValue("citizenImages", uploadedUrls); // Lưu URL ảnh thực tế vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

    const handleOthersFileChange = async (
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

            setFieldValue("otherImages", uploadedUrls); // Lưu URL ảnh thực tế vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

    const onSubmit = async (
        values: PersonalDonor,
        helpers: FormikHelpers<PersonalDonor>
    ) => {
        dispatch(setLoading(true));
        await dispatch(createPersonalDonorCertificateApiThunk(values))
            .unwrap()
            .then(() => {
                toast.success("Hoàn thành xác minh tài khoản cá nhân");
                setIsOpen(false);
                navigateHook(`${routes.user.personal}?tab=chungchi`);
            })
            .catch((error) => {
                const errorData = get(error, "data.message", null);
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    };

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/,/g, ""); // Remove commas
        if (!isNaN(Number(numericValue))) {
            return Number(numericValue).toLocaleString("en-US");
        }
        return value;
    };

    const handleIncomeChange = (
        e: ChangeEvent<HTMLInputElement>,
        setFieldValue: Function
    ) => {
        const formattedValue = formatCurrency(e.target.value);
        setFieldValue("monthlyIncome", formattedValue);
    };

    const handleResetForm = (resetForm: Function) => {
        resetForm(); // Reset Formik form fields
        setImagePreview([]); // Clear the image preview
        setOthersImagePreview([]);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="personal-donor-modal">
                <div className="pdm-container">
                    <h1>Xác minh tài khoản cá nhân</h1>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={schema}
                    >
                        {({
                            handleSubmit,
                            errors,
                            touched,
                            isSubmitting,
                            setFieldValue,
                            resetForm,
                        }) => (
                            <Form onSubmit={handleSubmit} className="form">
                                <h3>Thông tin cá nhân</h3>
                                <div className="pdm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Họ Và Tên<span>*</span>
                                        </label>
                                        <Field
                                            name="fullName"
                                            type="text"
                                            placeholder="Hãy nhập họ và tên của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.fullName &&
                                                        touched.fullName,
                                                }
                                            )}
                                        />
                                        {errors.fullName &&
                                            touched.fullName && (
                                                <span className="text-error">
                                                    {errors.fullName}
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Ngày Sinh<span>*</span>
                                        </label>
                                        <Field
                                            name="birthDay"
                                            type="date"
                                            max={
                                                new Date(
                                                    new Date().setFullYear(
                                                        new Date().getFullYear() -
                                                            18
                                                    )
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            min={
                                                new Date(
                                                    new Date().setFullYear(
                                                        new Date().getFullYear() -
                                                            80
                                                    )
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.birthDay &&
                                                        touched.birthDay,
                                                }
                                            )}
                                        />

                                        <p
                                            className="note"
                                            style={{
                                                marginTop: "5px",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            Chỉ người từ 18 tuổi trở lên mới
                                            được phép xác thực tài khoản.
                                        </p>
                                        {errors.birthDay &&
                                            touched.birthDay && (
                                                <span className="text-error">
                                                    {errors.birthDay}
                                                </span>
                                            )}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Email<span>*</span>
                                        </label>
                                        <Field
                                            name="email"
                                            type="text"
                                            placeholder="Hãy nhập email của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.email &&
                                                        touched.email,
                                                }
                                            )}
                                        />
                                        {errors.email && touched.email && (
                                            <span className="text-error">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Số Điện Thoại<span>*</span>
                                        </label>
                                        <Field
                                            name="phone"
                                            type="text"
                                            placeholder="Hãy nhập số điện thoại của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.phone &&
                                                        touched.phone,
                                                }
                                            )}
                                        />
                                        {errors.phone && touched.phone && (
                                            <span className="text-error">
                                                {errors.phone}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Địa Chỉ<span>*</span>
                                        </label>
                                        <Field
                                            name="address"
                                            type="text"
                                            placeholder="Hãy nhập địa chỉ của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.address &&
                                                        touched.address,
                                                }
                                            )}
                                        />
                                        {errors.address && touched.address && (
                                            <span className="text-error">
                                                {errors.address}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-100 form-field">
                                        <label className="form-label">
                                            Liên kết Mạng Xã Hội
                                        </label>
                                        <Field
                                            name="socialMediaLink"
                                            type="text"
                                            placeholder="Hãy liên kết xã hội của bạn của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.socialMediaLink &&
                                                        touched.socialMediaLink,
                                                }
                                            )}
                                        />
                                        {errors.socialMediaLink &&
                                            touched.socialMediaLink && (
                                                <span className="text-error">
                                                    {errors.socialMediaLink}
                                                </span>
                                            )}
                                    </div>
                                </div>
                                <h3>Thông tin tài chính</h3>
                                <div className="pdm-form-r2">
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Nguồn Thu Nhập Chính
                                        </label>
                                        <Field
                                            name="mainSourceIncome"
                                            type="text"
                                            placeholder="Hãy nhập nguồn Thu Nhập Chính của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.mainSourceIncome &&
                                                        touched.mainSourceIncome,
                                                }
                                            )}
                                        />
                                        {errors.mainSourceIncome &&
                                            touched.mainSourceIncome && (
                                                <span className="text-error">
                                                    {errors.mainSourceIncome}
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Thu Nhập Hàng Tháng (VNĐ)
                                        </label>
                                        <Field
                                            name="monthlyIncome"
                                            type="text"
                                            placeholder="Hãy nhập thu nhập hàng tháng của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.monthlyIncome &&
                                                        touched.monthlyIncome,
                                                }
                                            )}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) =>
                                                handleIncomeChange(
                                                    e,
                                                    setFieldValue
                                                )
                                            }
                                        />
                                        {errors.monthlyIncome &&
                                            touched.monthlyIncome && (
                                                <span className="text-error">
                                                    {errors.monthlyIncome}
                                                </span>
                                            )}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">
                                        Tải ảnh mặt trước, mặt sau của CCCD
                                        <span>*</span>
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
                                        className="form-input"
                                    />
                                    <p className="text-helper">
                                        Định dạng hỗ trợ: JPG, PNG (tối đa 5MB
                                        mỗi ảnh).
                                    </p>
                                    {errors.citizenImages &&
                                        touched.citizenImages && (
                                            <span className="text-error">
                                                {errors.citizenImages}
                                            </span>
                                        )}
                                </div>

                                {/* Xem trước ảnh */}
                                {imagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {imagePreview.map((img, index) => (
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
                                                        marginRight: "8px",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        setLightboxIndex(index)
                                                    } // mở lightbox khi click ảnh
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {lightboxIndex !== null && (
                                    <Lightbox
                                        images={imagePreview.map((src) => ({
                                            url: src,
                                        }))}
                                        startIndex={lightboxIndex}
                                        onClose={() => setLightboxIndex(null)}
                                    />
                                )}

                                <h2>Vui lòng nộp các giấy tờ liên quan:</h2>
                                <div className="document-section">
                                    <h3>📌 Hình ảnh hoạt động từ thiện:</h3>
                                    <ul>
                                        <li>
                                            Ảnh chụp cá nhân đang tham gia hoạt
                                            động từ thiện, như phát quà, giúp đỡ
                                            người khó khăn.
                                        </li>
                                        <li>
                                            Hình ảnh cần rõ ràng, có thể kèm
                                            ngày tháng và địa điểm (nếu có).
                                        </li>
                                    </ul>

                                    <h3>📌 Chứng nhận từ tổ chức (nếu có):</h3>
                                    <ul>
                                        <li>
                                            Nếu cá nhân hợp tác với tổ chức, vui
                                            lòng bổ sung giấy xác nhận.
                                        </li>
                                    </ul>
                                </div>

                                <div className="form-field">
                                    <label className="form-label">
                                        Chọn các ảnh liên quan<span>*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) =>
                                            handleOthersFileChange(
                                                e,
                                                setFieldValue,
                                                setOthersImagePreview
                                            )
                                        }
                                        className="form-input"
                                    />
                                    <p className="text-helper">
                                        Định dạng hỗ trợ: JPG, PNG (tối đa 5MB
                                        mỗi ảnh).
                                    </p>
                                    {errors.otherImages &&
                                        touched.otherImages && (
                                            <span className="text-error">
                                                {errors.otherImages}
                                            </span>
                                        )}
                                </div>

                                {/* Xem trước ảnh */}
                                {othersImagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {othersImagePreview.map(
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
                                                            marginRight: "8px",
                                                            borderRadius: "5px",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            setOthersLightboxIndex(
                                                                index
                                                            )
                                                        } // mở lightbox khi click ảnh
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {othersLightboxIndex !== null && (
                                    <Lightbox
                                        images={othersImagePreview.map(
                                            (src) => ({ url: src })
                                        )}
                                        startIndex={othersLightboxIndex}
                                        onClose={() =>
                                            setOthersLightboxIndex(null)
                                        }
                                    />
                                )}
                                <div className="group-btn">
                                    <div
                                        className="pr-btn"
                                        onClick={() =>
                                            handleResetForm(resetForm)
                                        }
                                    >
                                        Làm mới
                                    </div>
                                    <Button
                                        loading={isSubmitting}
                                        type="submit"
                                        title="Hoàn thành"
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    );
};

export default PersonalDonorModal;
