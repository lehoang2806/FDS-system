import { routes } from "@/routes/routeName"
import { navigateHook } from "../../routes/RouteApp"
import { IRegisterEmail } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/app/store";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { requestOTPApiThunk } from "@/services/auth/authThunk";
import { get } from "lodash";
import Button from "@/components/Elements/Button";
import classNames from "classnames";
import { selectIsAuthenticated } from "@/app/selector";
import { useEffect, useState } from "react";
import { RightIcon } from "@/assets/icons";

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [isSelectRoleOpen, setIsSelectRoleOpen] = useState(false);

    const initialValues: IRegisterEmail = {
        userEmail: "",
        password: "",
        fullName: "",
        phone: "",
        roleId: 0
    };

    useEffect(() => {
        document.title = "Đăng ký";
        if (isAuthenticated) {
            navigateHook(routes.user.home);
        }
    }, [isAuthenticated]);

    const schema = Yup.object().shape({
        fullName: Yup.string()
            .required("Họ và tên không được để trống")
            .min(3, "Họ và tên phải có ít nhất 3 ký tự"),

        userEmail: Yup.string()
            .required("Email không được để trống")
            .email("Email không hợp lệ"),

        password: Yup.string()
            .required("Mật khẩu không được để trống")
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

        phone: Yup.string()
            .required("Số điện thoại không được để trống")
            .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),

        roleId: Yup.number()
            .required("Vui lòng chọn vai trò")
            .test(
                "is-not-zero",
                "Vui lòng chọn vai trò",
                (value) => value !== 0
            ),
    });

    const onSubmit = async (values: IRegisterEmail, helpers: FormikHelpers<IRegisterEmail>) => {
        await dispatch(requestOTPApiThunk(values.userEmail)).unwrap().then(() => {
            toast.success("Đã gữi mã OTP đến email");
            navigateHook(routes.otp_auth, { state: values });
        }).catch((error) => {
            const errorMessage = get(error, 'data', 'An error occurred');
            toast.error(errorMessage);
        }).finally(() => {
            helpers.setSubmitting(false);
        });
    };

    return (
        <main id="register">
            <section id="register-section">
                <div className="rs-container">
                    <div className="col-flex rscc1"></div>
                    <div className="col-flex rscc2">
                        <div className="rscc2-main">
                            <h1>Đăng ký</h1>
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
                                            <label className="form-label">Email<span>*</span></label>
                                            <Field name="userEmail" type="email" placeholder="Hãy nhập email của bạn" className={classNames("form-input", { "is-error": errors.userEmail && touched.userEmail })} />
                                            {errors.userEmail && touched.userEmail && <span className="text-error">{errors.userEmail}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Họ Và Tên<span>*</span></label>
                                            <Field name="fullName" type="text" placeholder="Hãy nhập tên của bạn" className={classNames("form-input", { "is-error": errors.fullName && touched.fullName })} />
                                            {errors.fullName && touched.fullName && <span className="text-error">{errors.fullName}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Mật Khẩu<span>*</span></label>
                                            <Field name="password" type="password" placeholder="Hãy nhập mật khẩu của bạn" className={classNames("form-input", { "is-error": errors.password && touched.password })} />
                                            {errors.password && touched.password && <span className="text-error">{errors.password}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Số điện thoại<span>*</span></label>
                                            <Field name="phone" type="text" placeholder="Hãy nhập số điện thoại của bạn" className={classNames("form-input", { "is-error": errors.phone && touched.phone })} />
                                            {errors.phone && touched.phone && <span className="text-error">{errors.phone}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Lựa chọn vai trò<span>*</span></label>
                                            <div className="form-input-select-container">
                                                <Field
                                                    as="select"
                                                    name="roleId"
                                                    className={classNames("form-input-select form-input", { "is-error": errors.roleId && touched.roleId })}
                                                    onClick={() => setIsSelectRoleOpen(!isSelectRoleOpen)}
                                                >
                                                    <option value={0}>Chọn vai trò</option>
                                                    <option value={3}>Người tặng thực phẩm</option>
                                                    <option value={4}>Người nhận hỗ trợ</option>
                                                </Field>
                                                <RightIcon className={classNames("form-icon-select", { "rotate-45": isSelectRoleOpen })} />
                                            </div>
                                            {errors.roleId && touched.roleId && <span className="text-error">{errors.roleId}</span>}
                                        </div>
                                        <Button loading={isSubmitting} type="submit" title="Đăng ký" />
                                    </Form>
                                )}
                            </Formik>
                            <p>Bạn đã có tài khoản? <span onClick={() => navigateHook(routes.login)}>Đăng nhập</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default RegisterPage