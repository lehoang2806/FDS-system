import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { ChangeEvent, FC, useState } from "react"
import classNames from "classnames";
import Button from "@/components/Elements/Button";
import { useAppDispatch } from "@/app/store";
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { createNewsApiThunk } from "@/services/news/newsThunk";
import { get } from "lodash";

const StaffAddNewsPage: FC = () => {
    const dispatch = useAppDispatch();

    const [imagePreview, setImagePreview] = useState<string>();

    const initialValues: CreateNews = {
        title: "",
        image: "",
        content: "",
        dateStart: "",
        dateEnd: "",
    };

    const schema = Yup.object().shape({
        title: Yup.string()
            .required("Tiêu đề không được để trống")
            .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
            .max(100, "Tiêu đề không được vượt quá 100 ký tự"),

        image: Yup.string()
            .required("Hình ảnh không được để trống"),

        content: Yup.string()
            .required("Nội dung không được để trống")
            .min(10, "Nội dung phải có ít nhất 10 ký tự"),

        dateStart: Yup.date()
            .required("Ngày bắt đầu không được để trống")
            .typeError("Định dạng ngày không hợp lệ"),

        dateEnd: Yup.date()
            .required("Ngày kết thúc không được để trống")
            .typeError("Định dạng ngày không hợp lệ")
            .min(Yup.ref("dateStart"), "Ngày kết thúc phải sau ngày bắt đầu"),
    });

    const handleFileChange = async (
        event: ChangeEvent<HTMLInputElement>,
        setFieldValue: Function
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            try {
                const base64Image = await convertToBase64(file);
                setFieldValue("image", base64Image);
                setImagePreview(base64Image);
            } catch (error) {
                console.error("Lỗi khi chuyển đổi ảnh:", error);
            }
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const dateCurrent = new Date().toISOString().split("T")[0];

    const onSubmit = async (values: CreateNews, helpers: FormikHelpers<CreateNews>) => {
        await dispatch(createNewsApiThunk(values)).unwrap().then(() => {
            toast.success("Add News successfully");
            helpers.resetForm();
            setImagePreview(undefined);
        }).catch((error) => {
            const errorData = get(error, 'data', null);
            toast.error(errorData);
        }).finally(() => {
            helpers.setSubmitting(false);
        })
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
                isSubmitting,
                setFieldValue
            }) => (
                <Form onSubmit={handleSubmit}>
                    <section id="staff-add-news" className="staff-section">
                        <div className="staff-container san-container">
                            <div className="sancr1">
                                <h1>News</h1>
                                <p>Dashboard<span className="staff-tag">Add News</span></p>
                            </div>
                            <div className="sancr2">
                                <div className="sancr2r1">
                                    <h2></h2>
                                    <div className="group-btn">
                                        <button onClick={() => navigateHook(routes.staff.news.list)}>Cancel</button>
                                        <Button type="submit" title="Create News" loading={isSubmitting} />
                                    </div>
                                </div>
                                <hr />
                                <div className="sancr2r2">
                                    <div className="sancr2r2c1">
                                        <h3>News Status:</h3>
                                        <p>Pending</p>
                                    </div>
                                    <div className="sancr2r2c2">
                                        <h3>Created Date:</h3>
                                        <p>{dateCurrent}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="sancr2r3">
                                    <div className="form">
                                        <div className="form-field">
                                            <label className="form-label">Title</label>
                                            <Field name="title" type="text" placeholder="Hãy nhập tiêu đề" className={classNames("form-input", { "is-error": errors.title && touched.title })} />
                                            {errors.title && touched.title && <span className="text-error">{errors.title}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Content</label>
                                            <Field name="content" type="text" placeholder="Hãy nhập nội dung" className={classNames("form-input", { "is-error": errors.content && touched.content })} />
                                            {errors.content && touched.content && <span className="text-error">{errors.content}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Ảnh</label>
                                            <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setFieldValue)} className="form-input" />
                                            {errors.image && touched.image && <span className="text-error">{errors.image}</span>}
                                        </div>

                                        <div className="form-field">
                                            <label className="form-label">Ngày bắt đầu</label>
                                            <Field name="dateStart" type="datetime-local" className="form-input" />
                                            {errors.dateStart && touched.dateStart && <span className="text-error">{errors.dateStart}</span>}
                                        </div>

                                        <div className="form-field">
                                            <label className="form-label">Ngày kết thúc</label>
                                            <Field name="dateEnd" type="datetime-local" className="form-input" />
                                            {errors.dateEnd && touched.dateEnd && <span className="text-error">{errors.dateEnd}</span>}
                                        </div>

                                        {imagePreview && (
                                            <div className="image-preview-container">
                                                <img src={imagePreview} alt={`Preview`} className="image-preview" style={{ width: "100px", height: "100px" }} />
                                            </div>
                                        )}
                                    </div>
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

export default StaffAddNewsPage