import { ChangeEvent, FC, useState } from 'react'
import Modal from './Modal'
import { OrganizationDonorModalProps } from './type'
import { useAppDispatch } from '@/app/store';
import { OrganizationDonor } from '@/types/user';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { createOrganizationDonorCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { get } from 'lodash';
import { setLoading } from '@/services/app/appSlice';

const OrganizationDonorModal: FC<OrganizationDonorModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const initialValues: OrganizationDonor = {
        organizationName: '',
        taxIdentificationNumber: '',
        representativeName: '',
        representativePhone: '',
        representativeCitizenId: '',
        representativeEmail: '',
        images: []
    };

    const schema = Yup.object().shape({
        organizationName: Yup.string()
            .required('Organization Name is required'),
        taxIdentificationNumber: Yup.string()
            .required('Tax Identification Number is required'),
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

    const onSubmit = async (values: OrganizationDonor, helpers: FormikHelpers<OrganizationDonor>) => {
        dispatch(setLoading(true));
        await dispatch(createOrganizationDonorCertificateApiThunk(values)).unwrap().then(() => {
            toast.success("Nộp chứng chỉ thành công");
            setIsOpen(false);
            navigateHook(`${routes.user.personal}?tab=chungchi`);
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ organizationName: errorData });
            toast.error(errorData);
        }).finally(() => {
            helpers.setSubmitting(false);
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000);
        });
    }
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="organization-donor-modal">
                <div className="odm-container">
                    <h1>Trở thành tài khoản tổ chức</h1>
                    <h2>Các ảnh cần nộp để xác nhận danh tính</h2>
                    <h3>Giấy phép hoạt động:</h3>
                    <ul>
                        <li>Cung cấp ảnh hoặc bản scan giấy phép đăng ký tổ chức từ thiện hợp pháp.</li>
                    </ul>
                    <h3>Hình ảnh hoạt động:</h3>
                    <ul>
                        <li>Ảnh chụp các chương trình từ thiện mà tổ chức đã thực hiện.</li>
                        <li>Hình ảnh nên có logo hoặc dấu hiệu nhận diện tổ chức để tăng tính xác thực.</li>
                    </ul>
                    <h3>Hình ảnh biên lai hoặc tài liệu minh chứng (nếu có):</h3>
                    <ul>
                        <li>Nếu có hoạt động kêu gọi quyên góp, nên kèm theo ảnh chụp biên lai chuyển khoản hoặc giấy tờ xác nhận nhận tiền từ nhà hảo tâm.</li>
                    </ul>
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
                            <Form onSubmit={handleSubmit} className="form">
                                <h3>Thông tin tổ chức</h3>
                                <div className="form-field">
                                    <label className="form-label">Tên tổ chức</label>
                                    <Field name="organizationName" type="text" placeholder="Hãy nhập tên tố chức của bạn" className={classNames("form-input", { "is-error": errors.organizationName && touched.organizationName })} />
                                    {errors.organizationName && touched.organizationName && <span className="error">{errors.organizationName}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Mã số thuế</label>
                                    <Field name="taxIdentificationNumber" type="text" placeholder="Hãy nhập mã số thuế của bạn" className={classNames("form-input", { "is-error": errors.taxIdentificationNumber && touched.taxIdentificationNumber })} />
                                    {errors.taxIdentificationNumber && touched.taxIdentificationNumber && <span className="error">{errors.taxIdentificationNumber}</span>}
                                </div>
                                <h3>Thông tin người đại diện</h3>
                                <div className="form-field">
                                    <label className="form-label">Tên người đại diện</label>
                                    <Field name="representativeName" type="text" placeholder="Hãy nhập tên người đại diện" className={classNames("form-input", { "is-error": errors.representativeName && touched.representativeName })} />
                                    {errors.representativeName && touched.representativeName && <span className="error">{errors.representativeName}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Số điện thoại người đại diện</label>
                                    <Field name="representativePhone" type="text" placeholder="Hãy nhập số điện thoại của người đại diện" className={classNames("form-input", { "is-error": errors.representativePhone && touched.representativePhone })} />
                                    {errors.representativePhone && touched.representativePhone && <span className="error">{errors.representativePhone}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Email người đại diện</label>
                                    <Field name="representativeEmail" type="text" placeholder="Hãy nhập email của người đại diện" className={classNames("form-input", { "is-error": errors.representativeEmail && touched.representativeEmail })} />
                                    {errors.representativeEmail && touched.representativeEmail && <span className="error">{errors.representativeEmail}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">CCCD người đại diện</label>
                                    <Field name="representativeCitizenId" type="text" placeholder="Hãy nhập số CCCD của người đại diện" className={classNames("form-input", { "is-error": errors.representativeCitizenId && touched.representativeCitizenId })} />
                                    {errors.representativeCitizenId && touched.representativeCitizenId && <span className="error">{errors.representativeCitizenId}</span>}
                                </div>
                                <h3>Nộp Hình Ảnh</h3>
                                <div className="form-field">
                                    <label className="form-label">Hình Ảnh</label>
                                    <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setFieldValue)} className="form-input" />
                                    {errors.images && touched.images && <span className="text-error">{errors.images}</span>}
                                </div>

                                {imagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {imagePreview.map((img, index) => (
                                            <img key={index} src={img} alt={`Preview ${index}`} className="image-preview" style={{ width: "100px", height: "100px" }}/>
                                        ))}
                                    </div>
                                )}
                                <Button loading={isSubmitting} type="submit" title="Nộp chứng chỉ" />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default OrganizationDonorModal