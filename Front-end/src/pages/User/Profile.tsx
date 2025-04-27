import { selectUserLogin } from "@/app/selector";
import { useAppSelector } from "@/app/store";
import { RenderIf } from "@/components/Elements";
import Button from "@/components/Elements/Button";
import TextError from "@/components/Elements/TextError";
import { UserUpdate } from "@/types/user";
import { Field, Form, Formik } from "formik";
import { get } from "lodash";
import * as Yup from "yup";

const UserProfilePage = () => {
    const userProfile = useAppSelector(selectUserLogin);

    const initialValues: UserUpdate = {
        email: userProfile?.email ?? "",
        fullName: userProfile?.fullName ?? "",
        address: userProfile?.address ?? "",
        birthDay: userProfile?.birthDay ?? "",
        gender: userProfile?.gender ?? "",
        phone: userProfile?.phone ?? "",
    };

    const schema = Yup.object().shape({
        email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
        fullName: Yup.string().min(2, "Tên phải có ít nhất 2 ký tự").required("Tên là bắt buộc"),
        address: Yup.string().nullable(),
        birthDay: Yup.date().nullable().typeError("Ngày sinh không hợp lệ"),
        gender: Yup.string().oneOf(["male", "female", "other"], "Giới tính không hợp lệ").required("Giới tính là bắt buộc"),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
            .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
            .max(11, "Số điện thoại không được quá 11 chữ số")
            .required("Số điện thoại là bắt buộc"),
    });

    const onSubmit = async (_: UserUpdate) => {
        
    };

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
                                {/* <div className="up-avatar"></div> */}
                                <h1>Thông tin cá nhân</h1>
                                <div className="form">
                                    <div className="form-field">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <Field
                                            disabled
                                            name="email"
                                            className="form-input"

                                        />
                                        <RenderIf condition={Boolean(get(errors, "email") && get(touched, "email"))}>
                                            <TextError>{get(errors, "email")}</TextError>
                                        </RenderIf>

                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Tên tài khoản
                                        </label>
                                        <Field
                                            name="fullName"
                                            className="form-input"
                                        />
                                        <RenderIf condition={Boolean(get(errors, "fullName") && get(touched, "fullName"))}>
                                            <TextError>{get(errors, "fullName")}</TextError>
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
                                        <RenderIf condition={Boolean(get(errors, "address") && get(touched, "address"))}>
                                            <TextError>{get(errors, "address")}</TextError>
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
                                        {errors.phone && touched.phone && <span className="text-error">{errors.phone}</span>}
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Ngày sinh
                                        </label>
                                        <Field
                                            type="date"
                                            name="birthDay"
                                            className="form-input"
                                        />
                                        {errors.birthDay && touched.birthDay && <span className="text-error">{errors.birthDay}</span>}
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">
                                            Giới tính
                                        </label>
                                        <Field as="select" name="gender" className="form-input">
                                            <option value="">Chọn giới tính</option>
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                        </Field>
                                        {errors.gender && touched.gender && <span className="text-error">{errors.gender}</span>}
                                    </div>
                                </div>
                                <Button loading={isSubmitting} type="submit" title="Cập nhật" />
                            </div>
                        </section>
                    </Form>
                )}
            </Formik>
        </main>
    )
}

export default UserProfilePage