import { useAppDispatch } from '@/app/store';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { AddRecipientCertificate } from '@/types/user';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { getRecipientCertificateByIdApiThunk, updateRecipientCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { UpdateRecipientCertificateModalProps } from './type';
import Modal from './Modal';
import { get } from 'lodash';
import { setLoading } from '@/services/app/appSlice';

const UpdateRecipientCertificateModal: FC<UpdateRecipientCertificateModalProps> = ({ isOpen, setIsOpen, selectedCurrentRecipientCertificate }) => {
    const dispatch = useAppDispatch();

    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const initialValues: AddRecipientCertificate = {
        citizenId: selectedCurrentRecipientCertificate?.citizenId || '',
        fullName: selectedCurrentRecipientCertificate?.fullName || '',
        email: selectedCurrentRecipientCertificate?.email || '',
        phone: selectedCurrentRecipientCertificate?.phone || '',
        address: selectedCurrentRecipientCertificate?.address || '',
        birthDay: selectedCurrentRecipientCertificate?.birthDay || '',
        circumstances: selectedCurrentRecipientCertificate?.circumstances || '',
        registerSupportReason: selectedCurrentRecipientCertificate?.registerSupportReason || '',
        mainSourceIncome: selectedCurrentRecipientCertificate?.mainSourceIncome || '',
        monthlyIncome: selectedCurrentRecipientCertificate?.monthlyIncome || '',
        images: selectedCurrentRecipientCertificate?.images || [],
    };

    const schema = Yup.object().shape({
        citizenId: Yup.string().required('Vui lòng nhập mã công dân'),
        fullName: Yup.string().required('Vui lòng nhập họ và tên'),
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        phone: Yup.string()
            .matches(/^[0-9]{10,15}$/, 'Số điện thoại phải có từ 10 đến 15 chữ số')
            .required('Vui lòng nhập số điện thoại'),
        address: Yup.string().required('Vui lòng nhập địa chỉ'),
        birthDay: Yup.string()
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh không hợp lệ, định dạng YYYY-MM-DD')
            .required('Vui lòng nhập ngày sinh'),
        circumstances: Yup.string().required('Vui lòng nhập hoàn cảnh'),
        registerSupportReason: Yup.string().required('Vui lòng nhập lý do đăng ký hỗ trợ'),
        monthlyIncome: Yup.string()
            .test('is-valid-number', 'Thu nhập hàng tháng phải là số', value => {
                if (!value) return true; // allow empty
                const numeric = value.replace(/,/g, '');
                return !isNaN(Number(numeric));
            }),
        images: Yup.array().of(Yup.string().required('Mỗi ảnh phải là một chuỗi hợp lệ')).min(1, 'Cần ít nhất một ảnh').required('Danh sách ảnh là bắt buộc'),
    });

    const onSubmit = async (values: AddRecipientCertificate, helpers: FormikHelpers<AddRecipientCertificate>) => {
        dispatch(setLoading(true));
        await dispatch(updateRecipientCertificateApiThunk({ id: String(selectedCurrentRecipientCertificate?.recipientCertificateId), params: values })).unwrap().then(() => {
            toast.success("Cập nhật thành công");
            setIsOpen(false);
            dispatch(getRecipientCertificateByIdApiThunk(String(selectedCurrentRecipientCertificate?.recipientCertificateId)));
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ citizenId: errorData });
            toast.error(errorData);
        }).finally(() => {
            helpers.setSubmitting(false);
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000);
        });
    }

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

    useEffect(() => {
        if (selectedCurrentRecipientCertificate?.images?.length) {
            setImagePreview(selectedCurrentRecipientCertificate.images);
        } else {
            setImagePreview([]);
        }
    }, [selectedCurrentRecipientCertificate]);

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Recipient Certificate">
            <section id="recipient-certificate-modal">
                <div className="rcm-container">
                    <h1>Đăng ký chứng chỉ thu nhập thấp</h1>
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
                                <h3>Thông tin cá nhân</h3>
                                <div className="form-field">
                                    <label className="form-label">Họ Và Tên</label>
                                    <Field name="fullName" type="text" placeholder="Hãy nhập họ và tên của bạn" className={classNames("form-input", { "is-error": errors.fullName && touched.fullName })} />
                                    {errors.fullName && touched.fullName && <span className="text-error">{errors.fullName}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Ngày Sinh</label>
                                    <Field
                                        name="birthDay"
                                        type="date"
                                        className={classNames("form-input", { "is-error": errors.birthDay && touched.birthDay })}
                                    />
                                    {errors.birthDay && touched.birthDay && <span className="text-error">{errors.birthDay}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Email</label>
                                    <Field name="email" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.email && touched.email })} />
                                    {errors.email && touched.email && <span className="text-error">{errors.email}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Số Điện Thoại</label>
                                    <Field name="phone" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.phone && touched.phone })} />
                                    {errors.phone && touched.phone && <span className="text-error">{errors.phone}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Địa Chỉ</label>
                                    <Field name="address" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.address && touched.address })} />
                                    {errors.address && touched.address && <span className="text-error">{errors.address}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Căn cước công dân</label>
                                    <Field name="citizenId" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.citizenId && touched.citizenId })} />
                                    {errors.citizenId && touched.citizenId && <span className="text-error">{errors.citizenId}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Hoàn cảnh gia đình</label>
                                    <Field name="circumstances" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.circumstances && touched.circumstances })} />
                                    {errors.circumstances && touched.circumstances && <span className="text-error">{errors.circumstances}</span>}
                                </div>
                                <h3>Thông tin tài chính</h3>
                                <div className="form-field">
                                    <label className="form-label">Nguồn Thu Nhập Chính</label>
                                    <Field name="mainSourceIncome" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.mainSourceIncome && touched.mainSourceIncome })} />
                                    {errors.mainSourceIncome && touched.mainSourceIncome && <span className="text-error">{errors.mainSourceIncome}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Thu Nhập Hàng Tháng</label>
                                    <Field name="monthlyIncome" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.monthlyIncome && touched.monthlyIncome })} />
                                    {errors.monthlyIncome && touched.monthlyIncome && <span className="text-error">{errors.monthlyIncome}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Lý do đăng ký hỗ trợ</label>
                                    <Field name="registerSupportReason" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.registerSupportReason && touched.registerSupportReason })} />
                                    {errors.registerSupportReason && touched.registerSupportReason && <span className="text-error">{errors.registerSupportReason}</span>}
                                </div>
                                <h2>Vui lòng nộp các giấy tờ sau:</h2>
                                <div className="document-section">
                                    <h3>📌 Giấy tờ tùy thân:</h3>
                                    <ul>
                                        <li>Cung cấp ảnh chụp CMND/CCCD/Hộ chiếu để xác minh danh tính.</li>
                                    </ul>

                                    <h3>📌 Hình ảnh chứng minh hoàn cảnh:</h3>
                                    <ul>
                                        <li>Tài liệu chứng minh hoàn cảnh (Giấy xác nhận hộ nghèo, giấy khám bệnh, giấy khai sinh con nhỏ, v.v.)</li>
                                        <li>Hình ảnh cần rõ ràng, có thể kèm ngày tháng và địa điểm (nếu có).</li>
                                    </ul>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Chọn ảnh cần tải lên</label>
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
                                                    style={{ width: "100px", height: "100px", marginRight: "8px", borderRadius: "5px" }}
                                                />
                                            </div>
                                        ))}
                                    </div>
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

export default UpdateRecipientCertificateModal