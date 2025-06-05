import { IForgetPassword } from "@/types/auth";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import Button from "@/components/Elements/Button";
import { useAppDispatch } from "@/app/store";
import { requestOtpForgetPasswordApiThunk } from "@/services/auth/authThunk";
import { toast } from "react-toastify";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { get } from "lodash";
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/assets/icons";

const ForgotPasswordPage = () => {
    const dispatch = useAppDispatch();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const initialValues: IForgetPassword = {
        email: "",
        newPassword: "",
        confirmNewPassword: "",
    };

    const schema = Yup.object().shape({
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),

        newPassword: Yup.string()
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .required("Vui lòng nhập mật khẩu mới"),

        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
            .required("Vui lòng xác nhận mật khẩu mới"),
    });

    const onSubmit = async (
        values: IForgetPassword,
        helpers: FormikHelpers<IForgetPassword>
    ) => {
        await dispatch(requestOtpForgetPasswordApiThunk(values.email))
            .unwrap()
            .then(() => {
                toast.success("Đã gữi mã OTP đến email");
                navigateHook(routes.new_pass, { state: values });
            })
            .catch((error) => {
                const errorMessage = get(error, "data", "An error occurred");
                toast.error(errorMessage);
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    return (
        <main id="forgot-pass">
            <section id="fp-section">
                <div className="fps-container">
                    <div className="col-flex fpscc1"></div>
                    <div className="col-flex fpscc2">
                        <div className="fpscc2-main">
                            <h1>Quên mật khẩu</h1>
                            <p>
                                Hãy nhập địa chỉ email và mật khẩu mới của bạn.
                                Chúng tôi sẽ gữi mã xác thực đên tài khoản.
                            </p>
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
                                }) => (
                                    <Form
                                        onSubmit={handleSubmit}
                                        className="form"
                                    >
                                        <div className="form-field">
                                            <label className="form-label">
                                                Email
                                            </label>
                                            <Field
                                                name="email"
                                                type="email"
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
                                            )}{" "}
                                        </div>
                                        <div
                                            className="form-field"
                                            style={{ position: "relative" }}
                                        >
                                            <label className="form-label">
                                                Mật khẩu mới
                                            </label>
                                            <Field
                                                name="newPassword"
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Hãy nhập mật khẩu mới của bạn"
                                                className={classNames(
                                                    "form-input",
                                                    {
                                                        "is-error":
                                                            errors.newPassword &&
                                                            touched.newPassword,
                                                    }
                                                )}
                                            />
                                            <span
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                                className="toggle-password"
                                                style={{
                                                    position: "absolute",
                                                    right: "16px",
                                                    top: "42px",
                                                    fontSize: "14px",
                                                    cursor: "pointer",
                                                    userSelect: "none",
                                                    color: "#888",
                                                }}
                                            >
                                                {showNewPassword ? (
                                                    <EyeIcon />
                                                ) : (
                                                    <EyeCloseIcon />
                                                )}
                                            </span>
                                            {errors.newPassword &&
                                                touched.newPassword && (
                                                    <span className="text-error">
                                                        {errors.newPassword}
                                                    </span>
                                                )}
                                        </div>

                                        <div
                                            className="form-field"
                                            style={{ position: "relative" }}
                                        >
                                            <label className="form-label">
                                                Nhập lại mật khẩu mới
                                            </label>
                                            <Field
                                                name="confirmNewPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Hãy nhập lại mật khẩu mới của bạn"
                                                className={classNames(
                                                    "form-input",
                                                    {
                                                        "is-error":
                                                            errors.confirmNewPassword &&
                                                            touched.confirmNewPassword,
                                                    }
                                                )}
                                            />
                                            <span
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="toggle-password"
                                                style={{
                                                    position: "absolute",
                                                    right: "16px",
                                                    top: "42px",
                                                    fontSize: "14px",
                                                    cursor: "pointer",
                                                    userSelect: "none",
                                                    color: "#888",
                                                }}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeIcon />
                                                ) : (
                                                    <EyeCloseIcon />
                                                )}
                                            </span>
                                            {errors.confirmNewPassword &&
                                                touched.confirmNewPassword && (
                                                    <span className="text-error">
                                                        {
                                                            errors.confirmNewPassword
                                                        }
                                                    </span>
                                                )}
                                        </div>

                                        <Button
                                            loading={isSubmitting}
                                            type="submit"
                                            title="Gửi"
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

export default ForgotPasswordPage;
