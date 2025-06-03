import { selectIsAuthenticated, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import * as Yup from "yup";
import classNames from "classnames";
import { useEffect } from "react";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { ILoginEmail } from "@/types/auth";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { loginApiThunk } from "@/services/auth/authThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import Button from "@/components/Elements/Button";
import { Logo } from "@/assets/images";

const ManageLogin = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userProfile = useAppSelector(selectUserLogin);

    const initialValues: ILoginEmail = {
        userEmail: "",
        password: "",
    };

    const schema = Yup.object().shape({
        userEmail: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        password: Yup.string().required("Vui lòng nhập mật khẩu"),
    });

    useEffect(() => {
        if (isAuthenticated && userProfile?.roleId === 1) {
            navigateHook(routes.admin.dashboard);
        }
        if (isAuthenticated && userProfile?.roleId === 2) {
            navigateHook(routes.staff.dashboard);
        }
        if (userProfile?.roleId === 3 || userProfile?.roleId === 4) {
            navigateHook("/403");
        }
    }, [isAuthenticated]);

    const onSubmit = async (
        values: ILoginEmail,
        helpers: FormikHelpers<ILoginEmail>
    ) => {
        await dispatch(loginApiThunk(values))
            .unwrap()
            .then(() => {
                toast.success("Đăng nhập thành công");
            })
            .catch((error) => {
                const errorData = get(error, "data.message", null);
                helpers.setErrors({ userEmail: errorData });
                toast.error(errorData);
            })
            .finally(() => {
                helpers.setSubmitting(false);
            });
    };

    return (
        <main id="manage-login">
            <section id="ml-section">
                <div className="mls-container">
                    <div className="col-flex mlsc1">
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
                                isSubmitting,
                            }) => (
                                <Form onSubmit={handleSubmit} className="form">
                                    <div className="form-field">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <Field
                                            name="userEmail"
                                            type="email"
                                            placeholder="Hãy nhập email của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.userEmail &&
                                                        touched.userEmail,
                                                }
                                            )}
                                        />
                                        {errors.userEmail &&
                                            touched.userEmail && (
                                                <span className="text-error">
                                                    {errors.userEmail}
                                                </span>
                                            )}
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Mật Khẩu
                                        </label>
                                        <Field
                                            name="password"
                                            type="password"
                                            placeholder="Hãy nhập mật khẩu của bạn"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "is-error":
                                                        errors.password &&
                                                        touched.password,
                                                }
                                            )}
                                        />
                                        {errors.password &&
                                            touched.password && (
                                                <span className="text-error">
                                                    {errors.password}
                                                </span>
                                            )}
                                    </div>
                                    <Button
                                        loading={isSubmitting}
                                        type="submit"
                                        title="Đăng nhập"
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="col-flex mlsc2">
                        <figure className="mlsc2-img">
                            <img src={Logo} alt="" />
                        </figure>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ManageLogin;
