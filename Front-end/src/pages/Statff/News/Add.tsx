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

    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const initialValues: CreateNews = {
        newsTitle: "",
        images: [],
        newsDescripttion: "",
        supportBeneficiaries: "",
    };

    const schema = Yup.object().shape({
        newsTitle: Yup.string()
            .required("Tiêu đề không được để trống")
            .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
            .max(100, "Tiêu đề không được vượt quá 100 ký tự"),

        images: Yup.array().of(Yup.string().required('Mỗi ảnh phải là một chuỗi hợp lệ')).min(1, 'Cần ít nhất một ảnh').required('Danh sách ảnh là bắt buộc'),


        newsDescripttion: Yup.string()
            .required("Nội dung không được để trống")
            .min(10, "Nội dung phải có ít nhất 10 ký tự"),

        supportBeneficiaries: Yup.string()
            .required("Đối tượng hỗ trợ không được để trống")
    });

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const base64Promises = files.map(file => convertToBase64(file));

            try {
                const base64Images = await Promise.all(base64Promises);
                setFieldValue("images", base64Images); // 🔹 Lưu danh sách ảnh vào Formik
                setImagePreview(base64Images); // 🔹 Cập nhật ảnh xem trước
            } catch (error) {
                console.error("Error converting images:", error);
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
            setImagePreview([]);
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
                                            <Field name="newsTitle" type="text" placeholder="Hãy nhập tiêu đề" className={classNames("form-input", { "is-error": errors.newsTitle && touched.newsTitle })} />
                                            {errors.newsTitle && touched.newsTitle && <span className="text-error">{errors.newsTitle}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Description</label>
                                            <Field name="newsDescripttion" type="text" placeholder="Hãy nhập nội dung" className={classNames("form-input", { "is-error": errors.newsDescripttion && touched.newsDescripttion })} />
                                            {errors.newsDescripttion && touched.newsDescripttion && <span className="text-error">{errors.newsDescripttion}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Support Beneficiaries</label>
                                            <Field name="supportBeneficiaries" type="text" placeholder="Hãy nhập đối tượng hỗ trợ" className={classNames("form-input", { "is-error": errors.supportBeneficiaries && touched.supportBeneficiaries })} />
                                            {errors.supportBeneficiaries && touched.supportBeneficiaries && <span className="text-error">{errors.supportBeneficiaries}</span>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Ảnh</label>
                                            <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setFieldValue)} className={classNames("form-input", { "is-error": errors.images && touched.images })} />
                                            {errors.images && touched.images && <span className="text-error">{errors.images}</span>}
                                        </div>

                                        {imagePreview.length > 0 && (
                                            <div className="image-preview-container">
                                                {imagePreview.map((img, index) => (
                                                    <img key={index} src={img} alt={`Preview ${index}`} className="image-preview" style={{ width: "100px", height: "100px" }} />
                                                ))}
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