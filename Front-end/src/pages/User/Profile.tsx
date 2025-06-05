import { selectGetProfileUser, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { AvatarIcon, EditIcon } from "@/assets/icons";
import { RenderIf } from "@/components/Elements";
import Button from "@/components/Elements/Button";
import TextError from "@/components/Elements/TextError";
import { setLoading } from "@/services/app/appSlice";
import {
    getProfileApiThunk,
    updateUserProfileApiThunk,
} from "@/services/user/userThunk";
import { UserUpdate } from "@/types/user";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useRef } from "react";

const UserProfilePage = () => {
    const dispatch = useAppDispatch();
    const userProfile = useAppSelector(selectGetProfileUser);
    const useLogin = useAppSelector(selectUserLogin);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const CLOUDINARY_URL =
        "https://api.cloudinary.com/v1_1/dehc2ftiv/image/upload";
    const UPLOAD_PRESET = "fds_system";

    const initialValues: UserUpdate = {
        fullName: userProfile?.fullName ?? "",
        address: userProfile?.address ?? "",
        birthDay: userProfile?.birthDay ?? "",
        gender: userProfile?.gender ?? "",
        phone: userProfile?.phone ?? "",
        avatar: userProfile?.avatar ?? "",
    };

    const schema = Yup.object().shape({
        fullName: Yup.string()
            .min(2, "Tên phải có ít nhất 2 ký tự")
            .required("Tên là bắt buộc"),
        address: Yup.string().nullable(),
        birthDay: Yup.date()
            .nullable()
            .typeError("Ngày sinh không hợp lệ")
            .max(
                new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                "Bạn phải từ 18 tuổi trở lên"
            )
            .min(
                new Date(new Date().setFullYear(new Date().getFullYear() - 80)),
                "Tuổi không được vượt quá 80"
            ),

        gender: Yup.string()
            .oneOf(["male", "female", "other"], "Giới tính không hợp lệ")
            .required("Giới tính là bắt buộc"),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
            .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
            .max(11, "Số điện thoại không được quá 11 chữ số")
            .required("Số điện thoại là bắt buộc"),
    });

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: Function
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setImagePreview([previewUrl]); // Hiển thị ảnh preview

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            const res = await axios.post(CLOUDINARY_URL, formData);
            const uploadedUrl = res.data.secure_url;

            setFieldValue("avatar", uploadedUrl); // Gán URL vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

    const onSubmit = async (values: UserUpdate) => {
        dispatch(setLoading(true));
        dispatch(updateUserProfileApiThunk(values))
            .unwrap()
            .then(() => {
                toast.success("Cập nhật thông tin cá nhân thành công");
                dispatch(getProfileApiThunk(String(useLogin?.accountId)));
            })
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    };

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getProfileApiThunk(String(useLogin?.accountId)))
            .unwrap()
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, []);

    return (
        <main id="use-profile">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={schema}
                enableReinitialize={true}
            >
                {({ handleSubmit, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className="form">
                        <section id="up-section">
                            <div className="ups-container">
                                <Field name="avatar">
                                    {({ form }: any) => (
                                        <div
                                            className="up-avatar-wrapper group cursor-pointer relative"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <img
                                                src={
                                                    imagePreview[0] ||
                                                    form.values.avatar ||
                                                    userProfile?.avatar ||
                                                    AvatarIcon
                                                }
                                                className="up-avatar"
                                                alt="avatar"
                                            />
                                            {/* Icon hiển thị khi hover */}
                                            <div className="up-edit-overlay">
                                                <EditIcon className="up-edit-icon" />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                ref={fileInputRef}
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        form.setFieldValue
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </Field>
                                <h1>Thông tin cá nhân</h1>
                                <div className="form">
                                    <div className="form-field">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            value={userProfile?.email}
                                            disabled
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Tên tài khoản
                                        </label>
                                        <Field
                                            name="fullName"
                                            className="form-input"
                                        />
                                        <RenderIf
                                            condition={Boolean(
                                                get(errors, "fullName") &&
                                                    get(touched, "fullName")
                                            )}
                                        >
                                            <TextError>
                                                {get(errors, "fullName")}
                                            </TextError>
                                        </RenderIf>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Địa chỉ
                                        </label>
                                        <Field
                                            name="address"
                                            className="form-input"
                                        />
                                        <RenderIf
                                            condition={Boolean(
                                                get(errors, "address") &&
                                                    get(touched, "address")
                                            )}
                                        >
                                            <TextError>
                                                {get(errors, "address")}
                                            </TextError>
                                        </RenderIf>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Số điện thoại
                                        </label>
                                        <Field
                                            name="phone"
                                            className="form-input"
                                        />
                                        {errors.phone && touched.phone && (
                                            <span className="text-error">
                                                {errors.phone}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Ngày sinh
                                        </label>
                                        <Field
                                            type="date"
                                            name="birthDay"
                                            className="form-input"
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
                                        />
                                        {errors.birthDay &&
                                            touched.birthDay && (
                                                <span className="text-error">
                                                    {errors.birthDay}
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Giới tính
                                        </label>
                                        <Field
                                            as="select"
                                            name="gender"
                                            className="form-input"
                                        >
                                            <option value="">
                                                Chọn giới tính
                                            </option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                        </Field>
                                        {errors.gender && touched.gender && (
                                            <span className="text-error">
                                                {errors.gender}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    loading={isSubmitting}
                                    type="submit"
                                    title="Cập nhật"
                                />
                            </div>
                        </section>
                    </Form>
                )}
            </Formik>
        </main>
    );
};

export default UserProfilePage;
