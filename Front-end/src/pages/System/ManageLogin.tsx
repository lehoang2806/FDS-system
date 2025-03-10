import { selectIsAuthenticated, selectUserLogin } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import * as Yup from "yup";
import classNames from "classnames";
import { useEffect } from 'react';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { ILoginEmail } from '@/types/auth';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { loginApiThunk } from '@/services/auth/authThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import Button from '@/components/Elements/Button';

const ManageLogin = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userProfile = useAppSelector(selectUserLogin);
    const initialValues: ILoginEmail = {
        userEmail: "",
        password: "",
    };
    const schema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Required"),
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
        <main id="manage-login">
            <section id="ml-section">
                <div className="mls-container">
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
                            <Form onSubmit={handleSubmit} className='col-flex form'>
                                <div className="mlsc1">
                                    <figure className="mlsc1-logo">
                                        Logo
                                    </figure>
                                    <h1>Let's get you signed in</h1>
                                    <div className="form">
                                        <div className="form-field">
                                            <label className="form-label">Email</label>
                                            <Field
                                                name="userEmail"
                                                type="email"
                                                placeholder="admin@mail.com"
                                                className={classNames("form-input", { "is-error": errors.userEmail && touched.userEmail })}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Password</label>
                                            <Field
                                                name="password"
                                                type="password"
                                                placeholder="Nhập mật khẩu"
                                                className={classNames("form-input", { "is-error": errors.password && touched.password })}
                                            />
                                        </div>
                                        <Button
                                            loading={isSubmitting}
                                            title="Đăng nhập"
                                            type="submit"
                                        />
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className="col-flex mlsc2">
                        <figure className="mlsc2-img">
                        </figure>
                        <h2>Feature Rich 3D Charts</h2>
                        <p>Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet massa. Aliquam dignissim nec felis quis imperdiet.</p>
                        <button className="sc-btn">Learn More</button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ManageLogin