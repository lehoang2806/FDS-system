import { useAppDispatch, useAppSelector } from '@/app/store';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { AddRecipientCertificate } from '@/types/user';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { createRecipientCertificateApiThunk, getAllRecipientCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { ChangeEvent, FC, useState } from 'react';
import { RecipientCertificateModalProps } from './type';
import Modal from './Modal';
import { get } from 'lodash';
import { setLoading } from '@/services/app/appSlice';
import { selectUserLogin } from '@/app/selector';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css'; // import style

const RecipientCertificateModal: FC<RecipientCertificateModalProps> = ({ isOpen, setIsOpen }) => {
    const userLogin = useAppSelector(selectUserLogin);

    const dispatch = useAppDispatch();

    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const initialValues: AddRecipientCertificate = {
        citizenId: '',
        fullName: userLogin?.fullName || '',
        email: userLogin?.email || '',
        phone: userLogin?.phone || '',
        address: userLogin?.address || '',
        birthDay: userLogin?.birthDay || '',
        circumstances: '',
        registerSupportReason: '',
        mainSourceIncome: '',
        monthlyIncome: '',
        images: [],
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
        monthlyIncome: Yup.string()
            .test('is-valid-number', 'Thu nhập hàng tháng phải là số', value => {
                if (!value) return true; // allow empty
                const numeric = value.replace(/,/g, '');
                return !isNaN(Number(numeric));
            }),
        registerSupportReason: Yup.string().required('Vui lòng nhập lý do đăng ký hỗ trợ'),
        images: Yup.array().of(Yup.string().required('Mỗi ảnh phải là một chuỗi hợp lệ')).min(1, 'Cần ít nhất một ảnh').required('Danh sách ảnh là bắt buộc'),
    });

    const onSubmit = async (values: AddRecipientCertificate, helpers: FormikHelpers<AddRecipientCertificate>) => {
        dispatch(setLoading(true));
        await dispatch(createRecipientCertificateApiThunk(values)).unwrap().then(() => {
            toast.success("Hoàn thành xác minh tài khoản");
            setIsOpen(false);
            dispatch(getAllRecipientCertificateApiThunk());
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

    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/,/g, ''); // Remove commas
        if (!isNaN(Number(numericValue))) {
            return Number(numericValue).toLocaleString('en-US');
        }
        return value;
    };

    const handleIncomeChange = (e: ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
        const formattedValue = formatCurrency(e.target.value);
        setFieldValue('monthlyIncome', formattedValue);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="recipient-certificate-modal">
                <div className="rcm-container">
                    <h1>Xác minh tài khoản</h1>
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
                                <div className="rcm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Họ Và Tên<span>*</span></label>
                                        <Field name="fullName" type="text" placeholder="Hãy nhập họ và tên của bạn" className={classNames("form-input", { "is-error": errors.fullName && touched.fullName })} />
                                        {errors.fullName && touched.fullName && <span className="text-error">{errors.fullName}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Ngày Sinh<span>*</span></label>
                                        <Field
                                            name="birthDay"
                                            type="date"
                                            className={classNames("form-input", { "is-error": errors.birthDay && touched.birthDay })}
                                        />
                                        {errors.birthDay && touched.birthDay && <span className="text-error">{errors.birthDay}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Email<span>*</span></label>
                                        <Field name="email" type="text" placeholder="Hãy nhập email của bạn" className={classNames("form-input", { "is-error": errors.email && touched.email })} />
                                        {errors.email && touched.email && <span className="text-error">{errors.email}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Số Điện Thoại<span>*</span></label>
                                        <Field name="phone" type="text" placeholder="Hãy nhập số điện thoại của bạn" className={classNames("form-input", { "is-error": errors.phone && touched.phone })} />
                                        {errors.phone && touched.phone && <span className="text-error">{errors.phone}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Địa Chỉ<span>*</span></label>
                                        <Field name="address" type="text" placeholder="Hãy nhập địa chỉ của bạn" className={classNames("form-input", { "is-error": errors.address && touched.address })} />
                                        {errors.address && touched.address && <span className="text-error">{errors.address}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Căn cước công dân<span>*</span></label>
                                        <Field name="citizenId" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.citizenId && touched.citizenId })} />
                                        {errors.citizenId && touched.citizenId && <span className="text-error">{errors.citizenId}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Hoàn cảnh gia đình<span>*</span></label>
                                        <Field name="circumstances" type="text" placeholder="Hãy nhập hoàn cảnh gia đình của bạn" className={classNames("form-input", { "is-error": errors.circumstances && touched.circumstances })} />
                                        {errors.circumstances && touched.circumstances && <span className="text-error">{errors.circumstances}</span>}
                                    </div>
                                </div>
                                <h3>Thông tin tài chính</h3>
                                <div className="rcm-form-r2">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Nguồn Thu Nhập Chính</label>
                                        <Field name="mainSourceIncome" type="text" placeholder="Hãy nhập nguông thu nhập chính của bạn" className={classNames("form-input", { "is-error": errors.mainSourceIncome && touched.mainSourceIncome })} />
                                        {errors.mainSourceIncome && touched.mainSourceIncome && <span className="text-error">{errors.mainSourceIncome}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Thu Nhập Hàng Tháng (VNĐ)</label>
                                        <Field
                                            name="monthlyIncome"
                                            type="text"
                                            placeholder="Hãy nhập thu nhập hàng tháng của bạn"
                                            className={classNames('form-input', { 'is-error': errors.monthlyIncome && touched.monthlyIncome })}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleIncomeChange(e, setFieldValue)}
                                        />
                                        {errors.monthlyIncome && touched.monthlyIncome && (
                                            <span className="text-error">{errors.monthlyIncome}</span>
                                        )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Lý do đăng ký hỗ trợ<span>*</span></label>
                                        <Field name="registerSupportReason" type="text" placeholder="Hãy nhập lý do đăng ký hỗ trợ của bạn" className={classNames("form-input", { "is-error": errors.registerSupportReason && touched.registerSupportReason })} />
                                        {errors.registerSupportReason && touched.registerSupportReason && <span className="text-error">{errors.registerSupportReason}</span>}
                                    </div>
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
                                    <label className="form-label">Chọn ảnh cần tải lên<span>*</span></label>
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
                                <Button loading={isSubmitting} type="submit" title="Hoàn thành" />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default RecipientCertificateModal