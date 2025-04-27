import { ChangeEvent, FC, useEffect, useState } from 'react'
import Modal from './Modal'
import { useAppDispatch } from '@/app/store'
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { PersonalDonor } from '@/types/user';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { getPersonalDonorCertificateByIdApiThunk, updatePersonalDonorCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { UpdatePersonalDonorCertificateModalProps } from './type';
import { setLoading } from '@/services/app/appSlice';
import Lightbox from 'react-awesome-lightbox';

const UpdatePersonalDonorCertificateModal: FC<UpdatePersonalDonorCertificateModalProps> = ({ isOpen, setIsOpen, selectedCurrentPersonalDonorCertificate }) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const initialValues: PersonalDonor = {
        citizenId: selectedCurrentPersonalDonorCertificate?.citizenId || '',
        fullName: selectedCurrentPersonalDonorCertificate?.fullName || '',
        birthDay: selectedCurrentPersonalDonorCertificate?.birthDay || '',
        email: selectedCurrentPersonalDonorCertificate?.email || '',
        phone: selectedCurrentPersonalDonorCertificate?.phone || '',
        address: selectedCurrentPersonalDonorCertificate?.address || '',
        socialMediaLink: selectedCurrentPersonalDonorCertificate?.socialMediaLink || '',
        mainSourceIncome: selectedCurrentPersonalDonorCertificate?.mainSourceIncome || '',
        monthlyIncome: selectedCurrentPersonalDonorCertificate?.monthlyIncome || '',
        images: selectedCurrentPersonalDonorCertificate?.images || [],
    };

    const schema = Yup.object().shape({
        citizenId: Yup.string()
            .matches(/^\d+$/, 'CMND/CCCD phải là số')
            .required('CMND/CCCD không được để trống'),
        fullName: Yup.string().required('Họ và tên không được để trống'),
        birthDay: Yup.date().required('Ngày sinh không được để trống'),
        email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
        phone: Yup.string()
            .matches(/^\d+$/, 'Số điện thoại phải là số')
            .required('Số điện thoại không được để trống'),
        address: Yup.string().required('Địa chỉ không được để trống'),
        socialMediaLink: Yup.string().url('Liên kết mạng xã hội không hợp lệ'),
        monthlyIncome: Yup.number()
            .typeError('Thu nhập hàng tháng phải là số')
            .min(0, 'Thu nhập hàng tháng không được âm'),
        images: Yup.array().of(Yup.string().required('Mỗi ảnh phải là một chuỗi hợp lệ')).min(1, 'Cần ít nhất một ảnh').required('Danh sách ảnh là bắt buộc'),
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

    const onSubmit = async (values: PersonalDonor, helpers: FormikHelpers<PersonalDonor>) => {
        dispatch(setLoading(true));
        await dispatch(updatePersonalDonorCertificateApiThunk({ id: String(selectedCurrentPersonalDonorCertificate?.personalDonorCertificateId), params: values })).unwrap().then(() => {
            toast.success("Cập nhật thành công");
            setIsOpen(false);
            dispatch(getPersonalDonorCertificateByIdApiThunk(String(selectedCurrentPersonalDonorCertificate?.personalDonorCertificateId)));
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ citizenId: errorData });
            toast.error(errorData);
        }).finally(() => {
            helpers.setSubmitting(false);
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000)
        });
    }

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

    useEffect(() => {
        if (selectedCurrentPersonalDonorCertificate?.images?.length) {
            setImagePreview(selectedCurrentPersonalDonorCertificate.images);
        } else {
            setImagePreview([]);
        }
    }, [selectedCurrentPersonalDonorCertificate]);

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="personal-donor-modal">
                <div className="pdm-container">
                    <h1>Cập nhật đơn xác minh</h1>
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
                                <div className="pdm-form-r1">
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
                                    <div className="form-100 form-field">
                                        <label className="form-label">Liên kết Mạng Xã Hội</label>
                                        <Field name="socialMediaLink" type="text" placeholder="Hãy liên kết xã hội của bạn của bạn" className={classNames("form-input", { "is-error": errors.socialMediaLink && touched.socialMediaLink })} />
                                        {errors.socialMediaLink && touched.socialMediaLink && <span className="text-error">{errors.socialMediaLink}</span>}
                                    </div>
                                </div>
                                <h3>Thông tin tài chính</h3>
                                <div className="pdm-form-r2">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Nguồn Thu Nhập Chính</label>
                                        <Field name="mainSourceIncome" type="text" placeholder="Hãy nhập nguồn Thu Nhập Chính của bạn" className={classNames("form-input", { "is-error": errors.mainSourceIncome && touched.mainSourceIncome })} />
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
                                </div>
                                <h2>Vui lòng nộp các giấy tờ sau:</h2>
                                <div className="document-section">
                                    <h3>📌 Giấy tờ tùy thân:</h3>
                                    <ul>
                                        <li>Cung cấp ảnh chụp CMND/CCCD/Hộ chiếu để xác minh danh tính.</li>
                                    </ul>

                                    <h3>📌 Hình ảnh hoạt động từ thiện:</h3>
                                    <ul>
                                        <li>Ảnh chụp cá nhân đang tham gia hoạt động từ thiện, như phát quà, giúp đỡ người khó khăn.</li>
                                        <li>Hình ảnh cần rõ ràng, có thể kèm ngày tháng và địa điểm (nếu có).</li>
                                    </ul>

                                    <h3>📌 Chứng nhận từ tổ chức (nếu có):</h3>
                                    <ul>
                                        <li>Nếu cá nhân hợp tác với tổ chức, vui lòng bổ sung giấy xác nhận.</li>
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

export default UpdatePersonalDonorCertificateModal