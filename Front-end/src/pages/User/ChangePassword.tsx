import { useAppDispatch } from "@/app/store";
import Button from "@/components/Elements/Button";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { changePasswordApiThunk } from "@/services/auth/authThunk";
import { IChangePassword } from "@/types/auth";
import { get } from "lodash";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/assets/icons";

const UserChangePasswordPage = () => {
    const dispatch = useAppDispatch();

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const initialValues: IChangePassword & { confirmPassword: string } = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const schema = Yup.object().shape({
        oldPassword: Yup.string()
            .required("Vui lòng nhập mật khẩu hiện tại")
            .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự"),

        newPassword: Yup.string()
            .required("Vui lòng nhập mật khẩu mới")
            .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
            .notOneOf(
                [Yup.ref("oldPassword")],
                "Mật khẩu mới phải khác mật khẩu hiện tại"
            ),

        confirmPassword: Yup.string()
            .required("Vui lòng nhập lại mật khẩu mới")
            .oneOf([Yup.ref("newPassword")], "Mật khẩu nhập lại không khớp"),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        const { confirmPassword, ...payload } = values;
        await dispatch(changePasswordApiThunk(payload))
            .unwrap()
            .then(() => {
                toast.success("Đã thay đổi mật khẩu");
                navigateHook(routes.user.home);
            })
            .catch((error) => {
                const errorMessage = get(error, "data", "Đã xảy ra lỗi");
                toast.error(errorMessage);
            });
    };

    return (
        <main id="user-change-pass">
            <section id="ucp-section">
                <div className="ucps-container">
                    <div className="col-flex ucpscc1"></div>
                    <div className="col-flex ucpscc2">
                        <div className="ucpscc2-main">
                            <h1>Thay đổi mật khẩu</h1>
                            <p>
                                Hãy nhập mật khẩu hiện tại của bạn và mật khẩu
                                mới.
                            </p>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={schema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="form">
                                        {/* Mật khẩu cũ */}
                                        <div className="form-field">
                                            <Field
                                                type={
                                                    showOld
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="oldPassword"
                                                className="form-input"
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                            <span
                                                className="toggle-password"
                                                onClick={() =>
                                                    setShowOld(!showOld)
                                                }
                                            >
                                                {showOld ? (
                                                    <EyeIcon />
                                                ) : (
                                                    <EyeCloseIcon />
                                                )}
                                            </span>
                                            <ErrorMessage
                                                name="oldPassword"
                                                component="div"
                                                className="text-error"
                                            />
                                        </div>

                                        {/* Mật khẩu mới */}
                                        <div className="form-field">
                                            <Field
                                                type={
                                                    showNew
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="newPassword"
                                                className="form-input"
                                                placeholder="Nhập mật khẩu mới"
                                            />
                                            <span
                                                className="toggle-password"
                                                onClick={() =>
                                                    setShowNew(!showNew)
                                                }
                                            >
                                                {showNew ? (
                                                    <EyeIcon />
                                                ) : (
                                                    <EyeCloseIcon />
                                                )}
                                            </span>
                                            <ErrorMessage
                                                name="newPassword"
                                                component="div"
                                                className="text-error"
                                            />
                                        </div>

                                        {/* Nhập lại mật khẩu */}
                                        <div className="form-field">
                                            <Field
                                                type={
                                                    showConfirm
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="confirmPassword"
                                                className="form-input"
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                            <span
                                                className="toggle-password"
                                                onClick={() =>
                                                    setShowConfirm(!showConfirm)
                                                }
                                            >
                                                {showConfirm ? (
                                                    <EyeIcon />
                                                ) : (
                                                    <EyeCloseIcon />
                                                )}
                                            </span>
                                            <ErrorMessage
                                                name="confirmPassword"
                                                component="div"
                                                className="text-error"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            title="Thay đổi"
                                            loading={isSubmitting}
                                        />
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default UserChangePasswordPage;
