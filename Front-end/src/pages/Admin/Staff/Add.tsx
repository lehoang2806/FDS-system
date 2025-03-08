import { useAppDispatch } from "@/app/store";
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { AddStaff } from "@/types/user";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { FC } from "react"
import * as Yup from "yup";
import classNames from "classnames";
import { addStaffApiThunk } from "@/services/admin/staff/staffThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import Button from "@/components/Elements/Button";

const AdminAddStaffPage: FC = () => {
    const dispatch = useAppDispatch();

    const initialValues: AddStaff = {
        userEmail: "",
        password: "",
        phone: "",
        fullName: "",
    };

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
    });
    
    const onSubmit = async (values: AddStaff, helpers: FormikHelpers<AddStaff>) => { 
        await dispatch(addStaffApiThunk(values)).unwrap().then(() => {
            toast.success("Add staff successfully");
            helpers.resetForm();
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ userEmail: errorData });
        }).finally(() => {
            helpers.setSubmitting(false);
        });
     };
    return (
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
                <Form onSubmit={handleSubmit}>
                    <section id="admin-add-staff" className="admin-section">
                        <div className="admin-container aas-container">
                            <div className="aascr1">
                                <h1>Staff</h1>
                                <p>Dashboard<span className="admin-tag">Add Staff</span></p>
                            </div>
                            <div className="aascr2">
                                <div className="aascr2r1">
                                    <h2>#1</h2>
                                    <div className="group-btn">
                                        <button onClick={() => navigateHook(routes.admin.staff.list)}>Cancel</button>
                                        <Button type="submit" title="Create Staff" loading={isSubmitting}/>
                                    </div>
                                </div>
                                <hr />
                                <div className="aascr2r2">
                                    <div className="aascr2r2c1">
                                        <h3>Staff Status:</h3>
                                        <p>Active</p>
                                    </div>
                                    <div className="aascr2r2c2">
                                        <h3>Created Date:</h3>
                                        <p>25-02-2025</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="aascr2r3">
                                    <form className="form">
                                        <div className="form-field">
                                            <label className="form-label">Email</label>
                                            <Field name="userEmail" type="email" placeholder="Hãy nhập email của bạn" className={classNames("form-input", { "is-error": errors.userEmail && touched.userEmail })} />
                                            {errors.userEmail && touched.userEmail && <span className="text-error">{errors.userEmail}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Username</label>
                                            <Field name="fullName" type="text" placeholder="Hãy nhập tên người dung" className={classNames("form-input", { "is-error": errors.fullName && touched.fullName })} />
                                            {errors.fullName && touched.fullName && <span className="text-error">{errors.fullName}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Password</label>
                                            <Field name="password" type="password" placeholder="Hãy nhập mật khẩu" className={classNames("form-input", { "is-error": errors.password && touched.password })} />
                                            {errors.password && touched.password && <span className="text-error">{errors.password}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Phone</label>
                                            <Field name="phone" type="text" placeholder="Hãy nhập số diện thoại" className={classNames("form-input", { "is-error": errors.phone && touched.phone })} />
                                            {errors.phone && touched.phone && <span className="text-error">{errors.phone}</span>}
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </section>
                </Form>
            )
            }
        </Formik >
    )
}

export default AdminAddStaffPage