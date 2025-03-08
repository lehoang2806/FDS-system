import { selectIsAuthenticated, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { loginApiThunk } from "@/services/auth/authThunk";
import { ILoginEmail } from "@/types/auth";
import { Card } from "flowbite-react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { get } from "lodash";
import { toast } from "react-toastify";
import * as Yup from "yup";
import classNames from "classnames";
import Button from "@/components/Elements/Button";
import { useEffect } from "react";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userProfile = useAppSelector(selectUserLogin);
    const initialValues: ILoginEmail = {
        userEmail: "",
        password: "",
    };

    const schema = Yup.object().shape({
        userEmail: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
    });

    useEffect(() => {
        if (isAuthenticated && userProfile?.roleId === 1) {
            navigateHook(routes.admin.dashboard);
        }
    }, [isAuthenticated]);

    const onSubmit = async (values: ILoginEmail, helpers: FormikHelpers<ILoginEmail>) => {
        await dispatch(loginApiThunk(values)).unwrap().then(() => {
            toast.success("Login successfully");
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ userEmail: errorData });
            toast.error(errorData);
        }).finally(() => {
            helpers.setSubmitting(false);
        });
    };

    return (
        <section id="admin-login">
            <div className="login-container">
                <Card className="login-card">
                    <div className="login-left">
                        <h2 className="login-title">Let's get you signed in</h2>
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
                                        <label className="form-label">Email</label>
                                        <Field name="userEmail" type="email" placeholder="Hãy nhập email cảu bạn" className={classNames("form-input", { "is-error": errors.userEmail && touched.userEmail })} />
                                        {errors.userEmail && touched.userEmail && <p className="text-error">{errors.userEmail}</p>}
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Mật Khẩu</label>
                                        <Field name="password" type="password" placeholder="Hãy nhập mật khẩu cảu bạn" className={classNames("form-input", { "is-error": errors.password && touched.password })} />
                                        {errors.password && touched.password && <p className="text-error">{errors.password}</p>}
                                    </div>
                                    <Button loading={isSubmitting} type="submit" title="Đăng nhập" />
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="login-right">
                        <h3 className="system-title">FDS System</h3>
                        <p className="system-description">
                            Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet
                            massa. Aliquam dignissim nec felis quis imperdiet.
                        </p>
                    </div>
                </Card>
            </div>
        </section>

    );
}
