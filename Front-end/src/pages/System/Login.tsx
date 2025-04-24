import { Link } from "react-router-dom"
import { navigateHook } from "../../routes/RouteApp"
import { routes } from "@/routes/routeName"
import { ILoginEmail } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectIsAuthenticated } from "@/app/selector";
import * as Yup from "yup";
import { useEffect } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { loginApiThunk } from "@/services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import classNames from "classnames";
import Button from "@/components/Elements/Button";

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const initialValues: ILoginEmail = {
        userEmail: "",
        password: "",
    };
    
    const schema = Yup.object().shape({
        userEmail: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        password: Yup.string()
            .required("Vui lòng nhập mật khẩu"),
    });


    useEffect(() => {
        document.title = "Đăng nhập";
        if (isAuthenticated) {
            navigateHook(routes.user.campaign.list);
        }
    }, [isAuthenticated]);

    const onSubmit = async (values: ILoginEmail, helpers: FormikHelpers<ILoginEmail>) => {
        await dispatch(loginApiThunk(values)).unwrap().then(() => {
            toast.success("Đăng nhập thành công");
        }).catch((error) => {
            const errorData = get(error, 'data', 'An error occurred');
            toast.error(errorData);
        }).finally(() => {
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
                                            <Field name="userEmail" type="email" placeholder="Hãy nhập email của bạn" className={classNames("form-input", { "is-error": errors.userEmail && touched.userEmail })} />
                                            {errors.userEmail && touched.userEmail && <span className="text-error">{errors.userEmail}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Mật Khẩu<span>*</span></label>
                                            <Field name="password" type="password" placeholder="Hãy nhập mật khẩu của bạn" className={classNames("form-input", { "is-error": errors.password && touched.password })} />
                                            {errors.password && touched.password && <span className="text-error">{errors.password}</span>}
                                        </div>
                                        <Link to={routes.forgot_pass}>Quên mật khẩu</Link>
                                        <Button loading={isSubmitting} type="submit" title="Đăng nhập" />
                                    </Form>
                                )}
                            </Formik>
                            <p>Bạn chưa có tài khoản? <span onClick={() => navigateHook(routes.register)}>Đăng ký ngay</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LoginPage