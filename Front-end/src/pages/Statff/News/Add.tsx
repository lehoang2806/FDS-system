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
import Lightbox from "react-awesome-lightbox";

const StaffAddNewsPage: FC = () => {
    const dispatch = useAppDispatch();

    const [imagePreview, setImagePreview] = useState<string[]>([]); //state
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const initialValues: ActionParamNews = {
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

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const base64Promises = files.map(file => convertToBase64(file));

            try {
                const base64Images = await Promise.all(base64Promises);
                setFieldValue("images", base64Images); // 🔹 Lưu danh sách ảnh vào Formik
                setImagePreview(base64Images); // 🔹 Cập nhật ảnh xem trước
            } catch (_) {
            }
        }
    };

    const dateCurrent = new Date().toISOString().split("T")[0];

    const onSubmit = async (values: ActionParamNews, helpers: FormikHelpers<ActionParamNews>) => {
        await dispatch(createNewsApiThunk(values)).unwrap().then(() => {
            toast.success("Tạo tin tức thành công");
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
                                <h1>Tin tức</h1>
                                <p>Dashboard<span className="staff-tag">Tạo tin tức</span></p>
                            </div>
                            <div className="sancr2">
                                <div className="sancr2r1">
                                    <h2></h2>
                                    <div className="group-btn">
                                        <button onClick={() => navigateHook(routes.staff.news.list)}>Hủy</button>
                                        <Button type="submit" title="Tạo tin tức" loading={isSubmitting} />
                                    </div>
                                </div>
                                <hr />
                                <div className="sancr2r2">
                                    <div className="sancr2r2c1">
                                    </div>
                                    <div className="sancr2r2c2">
                                        <h3>Ngày tạo:</h3>
                                        <p>{dateCurrent}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="sancr2r3">
                                    <div className="form">
                                        <div className="form-50 form-field">
                                            <label className="form-label">Tiêu đề <span>*</span></label>
                                            <Field name="newsTitle" type="text" placeholder="Hãy nhập tiêu đề" className={classNames("form-input", { "is-error": errors.newsTitle && touched.newsTitle })} />
                                            {errors.newsTitle && touched.newsTitle && <span className="text-error">{errors.newsTitle}</span>}
                                        </div>
                                        <div className="form-50 form-field">
                                            <label className="form-label">Đối tượng hỗ trợ<span>*</span></label>
                                            <Field name="supportBeneficiaries" type="text" placeholder="Hãy nhập đối tượng hỗ trợ" className={classNames("form-input", { "is-error": errors.supportBeneficiaries && touched.supportBeneficiaries })} />
                                            {errors.supportBeneficiaries && touched.supportBeneficiaries && <span className="text-error">{errors.supportBeneficiaries}</span>}
                                        </div>
                                        <div className="form-100 form-field">
                                            <label className="form-label">Mô tả<span>*</span></label>
                                            <Field name="newsDescripttion" as="textarea" rows={10} placeholder="Hãy nhập nội dung" className={classNames("form-input", { "is-error": errors.newsDescripttion && touched.newsDescripttion })} />
                                            {errors.newsDescripttion && touched.newsDescripttion && <span className="text-error">{errors.newsDescripttion}</span>}
                                        </div>
                                        <div className="form-100 form-field">
                                            <label className="form-label">Hình Ảnh<span>*</span></label>
                                            <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setFieldValue)} className={classNames("form-input", { "is-error": errors.images && touched.images })} />
                                            {errors.images && touched.images && <span className="text-error">{errors.images}</span>}
                                        </div>

                                        {imagePreview.length > 0 && (
                                            <div className="image-preview-container">
                                                {imagePreview.map((img, index) => (
                                                    <div key={index} className="image-wrapper">
                                                        <img
                                                            src={img}
                                                            alt={`Preview ${index}`}
                                                            className="image-preview"
                                                            style={{
                                                                width: '100px',
                                                                height: '100px',
                                                                marginRight: '8px',
                                                                borderRadius: '5px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => setLightboxIndex(index)} // mở lightbox khi click ảnh
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {lightboxIndex !== null && (
                                            <Lightbox
                                                images={imagePreview.map((src) => ({ url: src }))}
                                                startIndex={lightboxIndex}
                                                onClose={() => setLightboxIndex(null)}
                                            />
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