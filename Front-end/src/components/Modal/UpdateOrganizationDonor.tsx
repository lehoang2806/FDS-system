import { ChangeEvent, FC, useEffect, useState } from 'react'
import Modal from './Modal'
import { UpdateOrganizationDonorCertificateModalProps } from './type'
import { useAppDispatch } from '@/app/store';
import { OrganizationDonor } from '@/types/user';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { getOrganizationDonorCertificateByIdApiThunk, updateOrganizationDonorCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { setLoading } from '@/services/app/appSlice';
import Lightbox from 'react-awesome-lightbox';

const UpdateOrganizationDonorCertificateModal: FC<UpdateOrganizationDonorCertificateModalProps> = ({ isOpen, setIsOpen, selectedCurrentOrganizationDonorCertificate }) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const initialValues: OrganizationDonor = {
        organizationName: selectedCurrentOrganizationDonorCertificate?.organizationName || '',
        taxIdentificationNumber: selectedCurrentOrganizationDonorCertificate?.taxIdentificationNumber || '',
        organizationAbbreviatedName: selectedCurrentOrganizationDonorCertificate?.organizationAbbreviatedName || '',
        organizationType: selectedCurrentOrganizationDonorCertificate?.organizationType || '',
        mainBusiness: selectedCurrentOrganizationDonorCertificate?.mainBusiness || '',
        organizationAddress: selectedCurrentOrganizationDonorCertificate?.organizationAddress || '',
        contactPhone: selectedCurrentOrganizationDonorCertificate?.contactPhone || '',
        organizationEmail: selectedCurrentOrganizationDonorCertificate?.organizationEmail || '',
        websiteLink: selectedCurrentOrganizationDonorCertificate?.websiteLink || '',
        representativeName: selectedCurrentOrganizationDonorCertificate?.representativeName || '',
        representativePhone: selectedCurrentOrganizationDonorCertificate?.representativePhone || '',
        representativeEmail: selectedCurrentOrganizationDonorCertificate?.representativeEmail || '',
        images: selectedCurrentOrganizationDonorCertificate?.images || []
    };

    const schema = Yup.object().shape({
        organizationName: Yup.string().required("Tên tổ chức không được để trống"),
        taxIdentificationNumber: Yup.string()
            .matches(/^\d+$/, "Mã số thuế phải là số")
            .required("Mã số thuế không được để trống"),
        organizationType: Yup.string().required("Loại hình tổ chức không được để trống"),
        mainBusiness: Yup.string().required("Ngành nghề chính không được để trống"),
        organizationAddress: Yup.string().required("Địa chỉ tổ chức không được để trống"),
        contactPhone: Yup.string()
            .matches(/^\d+$/, "Số điện thoại phải là số")
            .required("Số điện thoại không được để trống"),
        organizationEmail: Yup.string()
            .email("Email không hợp lệ")
            .required("Email tổ chức không được để trống"),
        websiteLink: Yup.string()
            .url("Liên kết website không hợp lệ"),
        representativeName: Yup.string().required("Tên người đại diện không được để trống"),
        representativePhone: Yup.string()
            .matches(/^\d+$/, "Số điện thoại người đại diện phải là số")
            .required("Số điện thoại người đại diện không được để trống"),
        representativeEmail: Yup.string()
            .email("Email người đại diện không hợp lệ")
            .required("Email người đại diện không được để trống"),
        images: Yup.array()
            .of(Yup.string()
                .required('Mỗi ảnh phải là một chuỗi hợp lệ'))
            .min(1, 'Cần ít nhất một ảnh')
            .required('Danh sách ảnh là bắt buộc'),

    });

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
        await dispatch(updateOrganizationDonorCertificateApiThunk({ id: String(selectedCurrentOrganizationDonorCertificate?.organizationDonorCertificateId), params: values })).unwrap().then(() => {
            toast.success("Nộp chứng chỉ thành công");
            setIsOpen(false);
            dispatch(getOrganizationDonorCertificateByIdApiThunk(String(selectedCurrentOrganizationDonorCertificate?.organizationDonorCertificateId)));
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

    useEffect(() => {
        if (selectedCurrentOrganizationDonorCertificate?.images?.length) {
            setImagePreview(selectedCurrentOrganizationDonorCertificate.images);
        } else {
            setImagePreview([]);
        }
    }, [selectedCurrentOrganizationDonorCertificate]);

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="organization-donor-modal">
                <div className="odm-container">
                    <h1>Trở thành tài khoản tổ chức</h1>
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
                                <div className="odm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Tên tổ chức<span>*</span></label>
                                        <Field name="organizationName" type="text" placeholder="Hãy nhập tên tổ chức của bạn" className={classNames("form-input", { "is-error": errors.organizationName && touched.organizationName })} />
                                        {errors.organizationName && touched.organizationName && <span className="error">{errors.organizationName}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Mã số thuế<span>*</span></label>
                                        <Field name="taxIdentificationNumber" type="text" placeholder="Nhập mã số thuế" className={classNames("form-input", { "is-error": errors.taxIdentificationNumber && touched.taxIdentificationNumber })} />
                                        {errors.taxIdentificationNumber && touched.taxIdentificationNumber && <span className="error">{errors.taxIdentificationNumber}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Tên viết tắt</label>
                                        <Field name="organizationAbbreviatedName" type="text" placeholder="Nhập tên viết tắt" className={classNames("form-input", { "is-error": errors.organizationAbbreviatedName && touched.organizationAbbreviatedName })} />
                                        {errors.organizationAbbreviatedName && touched.organizationAbbreviatedName && <span className="error">{errors.organizationAbbreviatedName}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Loại hình tổ chức<span>*</span></label>
                                        <Field name="organizationType" type="text" placeholder="Nhập loại hình tổ chức" className={classNames("form-input", { "is-error": errors.organizationType && touched.organizationType })} />
                                        {errors.organizationType && touched.organizationType && <span className="error">{errors.organizationType}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Ngành nghề chính<span>*</span></label>
                                        <Field name="mainBusiness" type="text" placeholder="Nhập ngành nghề chính" className={classNames("form-input", { "is-error": errors.mainBusiness && touched.mainBusiness })} />
                                        {errors.mainBusiness && touched.mainBusiness && <span className="error">{errors.mainBusiness}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Địa chỉ tổ chức<span>*</span></label>
                                        <Field name="organizationAddress" type="text" placeholder="Nhập địa chỉ tổ chức" className={classNames("form-input", { "is-error": errors.organizationAddress && touched.organizationAddress })} />
                                        {errors.organizationAddress && touched.organizationAddress && <span className="error">{errors.organizationAddress}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Số điện thoại<span>*</span></label>
                                        <Field name="contactPhone" type="tel" placeholder="Nhập số điện thoại tổ chức" className={classNames("form-input", { "is-error": errors.contactPhone && touched.contactPhone })} />
                                        {errors.contactPhone && touched.contactPhone && <span className="error">{errors.contactPhone}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Email tổ chức<span>*</span></label>
                                        <Field name="organizationEmail" type="email" placeholder="Nhập email tổ chức" className={classNames("form-input", { "is-error": errors.organizationEmail && touched.organizationEmail })} />
                                        {errors.organizationEmail && touched.organizationEmail && <span className="error">{errors.organizationEmail}</span>}
                                    </div>

                                    <div className="form-100 form-field">
                                        <label className="form-label">Website</label>
                                        <Field name="websiteLink" type="url" placeholder="Nhập liên kết website" className={classNames("form-input", { "is-error": errors.websiteLink && touched.websiteLink })} />
                                        {errors.websiteLink && touched.websiteLink && <span className="error">{errors.websiteLink}</span>}
                                    </div>
                                </div>
                                <h3>Thông tin người đại diện</h3>
                                <div className="odm-form-r2">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Tên người đại diện<span>*</span></label>
                                        <Field name="representativeName" type="text" placeholder="Nhập tên người đại diện" className={classNames("form-input", { "is-error": errors.representativeName && touched.representativeName })} />
                                        {errors.representativeName && touched.representativeName && <span className="error">{errors.representativeName}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Số điện thoại người đại diện<span>*</span></label>
                                        <Field name="representativePhone" type="tel" placeholder="Nhập số điện thoại người đại diện" className={classNames("form-input", { "is-error": errors.representativePhone && touched.representativePhone })} />
                                        {errors.representativePhone && touched.representativePhone && <span className="error">{errors.representativePhone}</span>}
                                    </div>

                                    <div className="form-50 form-field">
                                        <label className="form-label">Email người đại diện<span>*</span></label>
                                        <Field name="representativeEmail" type="email" placeholder="Nhập email người đại diện" className={classNames("form-input", { "is-error": errors.representativeEmail && touched.representativeEmail })} />
                                        {errors.representativeEmail && touched.representativeEmail && <span className="error">{errors.representativeEmail}</span>}
                                    </div>
                                </div>
                                <h2>Vui lòng nộp các giấy tờ sau:</h2>

                                <div className="document-section">
                                    <h3 className="document-title">📌 Giấy phép hoạt động</h3>
                                    <ul className="document-list">
                                        <li>Cung cấp ảnh hoặc bản scan của giấy phép đăng ký tổ chức từ thiện hợp pháp.</li>
                                    </ul>
                                </div>

                                <div className="document-section">
                                    <h3 className="document-title">📌 Hình ảnh hoạt động</h3>
                                    <ul className="document-list">
                                        <li>Ảnh chụp các chương trình từ thiện mà tổ chức đã thực hiện.</li>
                                        <li>Hình ảnh nên có logo hoặc dấu hiệu nhận diện của tổ chức để tăng tính xác thực.</li>
                                    </ul>
                                </div>

                                <div className="document-section">
                                    <h3 className="document-title">📌 Biên lai hoặc tài liệu minh chứng (nếu có)</h3>
                                    <ul className="document-list">
                                        <li>Nếu tổ chức có hoạt động kêu gọi quyên góp, vui lòng cung cấp ảnh chụp biên lai chuyển khoản hoặc giấy tờ xác nhận từ nhà hảo tâm.</li>
                                    </ul>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Chọn ảnh cần tải lên <span>*</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, setFieldValue)}
                                        className="form-input"
                                    />
                                    <p className="text-helper">Định dạng hỗ trợ: JPG, PNG (tối đa 5MB mỗi ảnh).</p>
                                    {errors.images && touched.images && <span className="text-error">{errors.images}</span>}
                                </div>

                                {/* Xem trước ảnh */}
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
                                <Button loading={isSubmitting} type="submit" title="Cập nhật" />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default UpdateOrganizationDonorCertificateModal