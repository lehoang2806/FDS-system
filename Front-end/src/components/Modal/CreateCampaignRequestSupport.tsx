import { ChangeEvent, FC, useState } from "react";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from "@/app/store";
import * as Yup from "yup";
import moment from "moment";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { get } from "lodash";
import Button from "../Elements/Button";
import classNames from "classnames";
import { format } from "date-fns";
import { setLoading } from "@/services/app/appSlice";
import Lightbox from "react-awesome-lightbox";
import axios from "axios";
import { CampaignRequestSupportActionsParams } from "@/types/campaignRequestSupport";
import {
    createCampaignRequestSupportApiThunk,
    getAllCampaignRequestSupportApiThunk,
} from "@/services/campaignRequestSupport/campaignRequestSupportThunk";
import { CreateCampaignRequestSupportModalProps } from "./type";
import {
    getRequestSupportByIdApiThunk,
    participateRequestSupportApiThunk,
} from "@/services/requestSupport/requestSupportThunk";
import { selectUserLogin } from "@/app/selector";

const CreateCampaignRequestSupportModal: FC<
    CreateCampaignRequestSupportModalProps
> = ({ isOpen, setIsOpen, requestSupport }) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const useLogin = useAppSelector(selectUserLogin);

    const CLOUDINARY_URL =
        "https://api.cloudinary.com/v1_1/dehc2ftiv/image/upload";
    const UPLOAD_PRESET = "fds_system";

    const initialValues: CampaignRequestSupportActionsParams = {
        campaignRequestSupportName: "",
        campaignRequestSupportDescription: "",
        location: requestSupport?.address || "",
        implementationTime: "",
        estimatedBudget: "",
        averageCostPerGift: "",
        sponsors: "",
        implementationMethod: "",
        communication: "",
        limitedQuantity: requestSupport?.desiredQuantity || 0,
        images: [],
        requestSupportId: requestSupport?.requestSupportId || "",
    };

    const schema = Yup.object().shape({
        campaignRequestSupportName: Yup.string()
            .required("Tên chiến dịch không được để trống")
            .min(3, "Tên chiến dịch phải có ít nhất 3 ký tự"),

        location: Yup.string().required("Địa chỉ không được để trống"),

        implementationTime: Yup.string()
            .required("Ngày nhận không được để trống")
            .test(
                "is-future-date",
                "Ngày nhận phải sau ít nhất 2 ngày kể từ hôm nay",
                (value) => {
                    if (!value) return false;
                    const selectedDate = moment(value);
                    const minDate = moment().add(2, "days").startOf("day");
                    return selectedDate.isAfter(minDate);
                }
            )
            .test(
                "is-within-working-hours",
                "Thời gian nhận phải từ 07:00 đến 17:00",
                (value) => {
                    if (!value) return false;
                    const hour = moment(value).hour();
                    return hour >= 7 && hour < 17;
                }
            ),

        implementationMethod: Yup.string().required(
            "Phương thức thực hiện là bắt buộc"
        ),

        limitedQuantity: Yup.number()
            .required("Số lượng là bắt buộc")
            .min(10, "Số lượng quà tặng ít nhất là 10 phần quà"),
        // .max(
        //     Number(requestSupport?.DesiredQuantity),
        //     `Số lượng quà tặng nhỏ hơn ${requestSupport?.DesiredQuantity}`
        // ),

        images: Yup.array()
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

            setFieldValue("images", uploadedUrls); // Lưu URL ảnh thực tế vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

    const onSubmit = async (
        values: CampaignRequestSupportActionsParams,
        helpers: FormikHelpers<CampaignRequestSupportActionsParams>
    ) => {
        dispatch(setLoading(true)); // Cập nhật trạng thái loading
        await Promise.all([
            dispatch(createCampaignRequestSupportApiThunk(values)).unwrap(),
            dispatch(
                participateRequestSupportApiThunk({
                    requestSupportId: String(requestSupport?.requestSupportId),
                    donorId: String(useLogin?.accountId),
                    params: "Participating",
                })
            ).unwrap(),
        ])
            .then(() => {
                toast.success("Tạo chiến dịch thành công");
                dispatch(getAllCampaignRequestSupportApiThunk());
                dispatch(
                    getRequestSupportByIdApiThunk(
                        String(requestSupport?.requestSupportId)
                    )
                );
                setIsOpen(false);
                handleResetForm(helpers.resetForm);
            })
            .catch((error) => {
                const errorData = get(
                    error,
                    "data.message",
                    "An error occurred"
                );
                helpers.setErrors({ campaignRequestSupportName: errorData });
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    };

    const handleResetForm = (resetForm: Function) => {
        resetForm(); // Reset Formik form fields
        setImagePreview([]); // Clear the image preview
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="create-campaign-modal">
                <div className="ccm-container">
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
                            values,
                            setFieldValue,
                            resetForm,
                        }) => (
                            <Form onSubmit={handleSubmit} className="form">
                                <h1>Tạo chiến dịch</h1>
                                <h3>Thông tin chiến dịch</h3>
                                <div className="ccm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Tên chiến dịch <span>*</span>
                                        </label>
                                        <Field
                                            name="campaignRequestSupportName"
                                            type="text"
                                            placeholder="Hãy nhập tên chiến dịch"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.campaignRequestSupportName &&
                                                        touched.campaignRequestSupportName,
                                                }
                                            )}
                                        />
                                        {errors.campaignRequestSupportName &&
                                            touched.campaignRequestSupportName && (
                                                <span className="text-error">
                                                    {
                                                        errors.campaignRequestSupportName
                                                    }
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Địa điểm<span>*</span>
                                        </label>
                                        <Field
                                            name="location"
                                            type="text"
                                            placeholder="Hãy nhập địa điẻm giao quà"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.location &&
                                                        touched.location,
                                                }
                                            )}
                                        />
                                        {errors.location &&
                                            touched.location && (
                                                <span className="text-error">
                                                    {errors.location}
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Thời gian và ngày nhận quà
                                            <span>*</span>
                                        </label>
                                        <Field
                                            name="implementationTime"
                                            type="datetime-local"
                                            value={
                                                values.implementationTime
                                                    ? format(
                                                          new Date(
                                                              values.implementationTime
                                                          ),
                                                          "yyyy-MM-dd'T'HH:mm"
                                                      )
                                                    : ""
                                            }
                                            min={format(
                                                new Date(
                                                    Date.now() +
                                                        2 * 24 * 60 * 60 * 1000
                                                ),
                                                "yyyy-MM-dd'T'HH:mm"
                                            )}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => {
                                                const selectedDate = new Date(
                                                    e.target.value
                                                );
                                                const hours =
                                                    selectedDate.getHours();

                                                if (hours <= 7 || hours >= 17) {
                                                    toast.warning(
                                                        "Vui lòng chỉ chọn thời gian trong khoảng 7 giờ đến 17 giờ"
                                                    );
                                                    return;
                                                }

                                                setFieldValue(
                                                    "implementationTime",
                                                    e.target.value
                                                );
                                            }}
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.implementationTime &&
                                                        touched.implementationTime,
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
                                            Thời gian nhận cần cách ngày hiện
                                            tại ít nhất 2 ngày và trong khoảng
                                            từ 7 giờ đến 17 giờ.
                                        </p>
                                        {errors.implementationTime &&
                                            touched.implementationTime && (
                                                <span className="text-error">
                                                    {errors.implementationTime}
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Phương thức thực hiện<span>*</span>
                                        </label>
                                        <Field
                                            name="implementationMethod"
                                            type="text"
                                            placeholder="Hãy nhập phương thức thực hiện"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.implementationMethod &&
                                                        touched.implementationMethod,
                                                }
                                            )}
                                        />
                                        {errors.implementationMethod &&
                                            touched.implementationMethod && (
                                                <span className="text-error">
                                                    {
                                                        errors.implementationMethod
                                                    }
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">
                                            Số lượng quà tặng<span>*</span>
                                        </label>
                                        <Field
                                            name="limitedQuantity"
                                            type="text"
                                            placeholder="Nhập số lượng"
                                            className="form-input"
                                        />
                                        {errors.limitedQuantity &&
                                            touched.limitedQuantity && (
                                                <span className="text-error">
                                                    {errors.limitedQuantity}
                                                </span>
                                            )}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">
                                        Ảnh<span>*</span>
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
                                        className={classNames("form-input", {
                                            "is-error":
                                                errors.images && touched.images,
                                        })}
                                    />
                                    {errors.images && touched.images && (
                                        <span className="text-error">
                                            {errors.images}
                                        </span>
                                    )}
                                </div>

                                {/* Hiển thị ảnh preview */}
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

                                {/* Hiển thị lightbox khi click vào ảnh preview */}
                                {lightboxIndex !== null && (
                                    <Lightbox
                                        images={imagePreview.map((src) => ({
                                            url: src,
                                        }))}
                                        startIndex={lightboxIndex}
                                        onClose={() => setLightboxIndex(null)}
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
                                        type="submit"
                                        title="Tạo chiến dịch"
                                        loading={isSubmitting}
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

export default CreateCampaignRequestSupportModal;
