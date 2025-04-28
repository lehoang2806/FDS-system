import { Link } from "react-router-dom";
import { navigateHook } from "../../routes/RouteApp";
import { routes } from "@/routes/routeName";
import { ILoginEmail } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectIsAuthenticated } from "@/app/selector";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { loginApiThunk } from "@/services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import classNames from "classnames";
import Button from "@/components/Elements/Button";

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [idTokenGoogle, setIdTokenGoogle] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [roleId, setRoleId] = useState(4); // default 4 (user)

    const initialValues: ILoginEmail = {
        userEmail: "",
        password: "",
    };

    const schema = Yup.object().shape({
        userEmail: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        password: Yup.string().required("Vui lòng nhập mật khẩu"),
    });

    useEffect(() => {
        document.title = "Đăng nhập";

        if (isAuthenticated) {
            navigateHook(routes.user.campaign.list);
        }
    }, [isAuthenticated]);

    // Load Google SDK và setup login
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: "73338291899-jn529f62svg546dd3qagvkvnlodc7nbi.apps.googleusercontent.com",
                    callback: handleCredentialResponse,
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-button"),
                    { theme: "outline", size: "large" }
                );
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleCredentialResponse = async (response: any) => {
        const id_token = response.credential;
        console.log("idtoken: ", id_token);

        try {
            const res = await fetch("http://localhost:5213/api/Auth/logingoogle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: id_token }),
            });

            const data = await res.json();
            console.log("JWT server:", data.token);
            console.log(data);

            if (data.token) {
                // Đã có tài khoản ➔ login thẳng
                toast.success("Đăng nhập Google thành công");
                localStorage.setItem("accessToken", data.token);
                navigateHook(routes.user.campaign.list);
            } else {
                // Chưa có tài khoản ➔ yêu cầu nhập phone/role
                setIdTokenGoogle(id_token);
                setShowRegisterModal(true);
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            toast.error("Đăng nhập Google thất bại");
        }
    };


    const handleQuickRegister = async () => {
        if (!idTokenGoogle) return;

        try {
            const res = await fetch("http://localhost:5213/api/Auth/logingoogle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idToken: idTokenGoogle,
                    phoneNumber,
                    roleId,
                }),
            });

            const data = await res.json();
            console.log("Register and login:", data);

            if (data.token) {
                toast.success("Đăng ký và đăng nhập thành công!");
                localStorage.setItem("accessToken", data.token);
                setShowRegisterModal(false);
                navigateHook(routes.user.campaign.list);
            } else {
                toast.error("Đăng ký thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error during quick register:", error);
            toast.error("Có lỗi xảy ra.");
        }
    };


    const onSubmit = async (values: ILoginEmail, helpers: FormikHelpers<ILoginEmail>) => {
        await dispatch(loginApiThunk(values)).unwrap()
            .then(() => {
                toast.success("Đăng nhập thành công");
            })
            .catch((error) => {
                const errorData = get(error, 'data', 'An error occurred');
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    return (
        <main id="login">
            <section id="login-section">
                <div className="ls-container">
                    <div className="col-flex lscc1"></div>
                    <div className="col-flex lscc2">
                        <div className="lscc2-main">
                            <h1>Đăng nhập</h1>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={onSubmit}
                                validationSchema={schema}
                            >
                                {({
                                    handleSubmit,
                                    errors,
                                    touched,
                                    isSubmitting
                                }) => (
                                    <Form onSubmit={handleSubmit} className="form">
                                        <div className="form-field">
                                            <label className="form-label">Email <span>*</span></label>
                                            <Field
                                                name="userEmail"
                                                type="email"
                                                placeholder="Hãy nhập email của bạn"
                                                className={classNames("form-input", { "is-error": errors.userEmail && touched.userEmail })}
                                            />
                                            {errors.userEmail && touched.userEmail && (
                                                <span className="text-error">{errors.userEmail}</span>
                                            )}
                                        </div>

                                        <div className="form-field">
                                            <label className="form-label">Mật khẩu <span>*</span></label>
                                            <Field
                                                name="password"
                                                type="password"
                                                placeholder="Hãy nhập mật khẩu của bạn"
                                                className={classNames("form-input", { "is-error": errors.password && touched.password })}
                                            />
                                            {errors.password && touched.password && (
                                                <span className="text-error">{errors.password}</span>
                                            )}
                                        </div>

                                        <Link to={routes.forgot_pass}>Quên mật khẩu</Link>
                                        <Button loading={isSubmitting} type="submit" title="Đăng nhập" />
                                    </Form>
                                )}
                            </Formik>

                            {/* Hoặc separator nếu bạn muốn: */}
                            <div className="or-separator">
                                <span>Hoặc</span>
                            </div>

                            {/* Div này sẽ được Google render nút Sign-In */}
                            <div id="google-signin-button" style={{ marginTop: "1rem" }}></div>

                            <p>Bạn chưa có tài khoản? <span onClick={() => navigateHook(routes.register)}>Đăng ký ngay</span></p>
                        </div>
                    </div>
                </div>
            </section>
            {showRegisterModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Hoàn thiện tài khoản</h2>
                        <div className="form-field">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div className="form-field">
                            <label>Vai trò</label>
                            <select value={roleId} onChange={(e) => setRoleId(Number(e.target.value))}>
                                <option value={3}>Tổ chức</option>
                                <option value={4}>Cá nhân</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleQuickRegister}>Xác nhận</button>
                            <button onClick={() => setShowRegisterModal(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
};

export default LoginPage;
