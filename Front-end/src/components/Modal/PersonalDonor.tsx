import { ChangeEvent, FC, useState } from 'react'
import Modal from './Modal'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { PersonalDonor } from '@/types/user';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { createPersonalDonorCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { PersonalDonorModalProps } from './type';
import { setLoading } from '@/services/app/appSlice';
import { selectUserLogin } from '@/app/selector';

const PersonalDonorModal: FC<PersonalDonorModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const userLogin = useAppSelector(selectUserLogin);

    const initialValues: PersonalDonor = {
        citizenId: '',
        fullName: userLogin?.fullName || '',
        birthDay: userLogin?.birthDay || '',
        email: userLogin?.email || '',
        phone: userLogin?.phone || '',
        address: userLogin?.address || '',
        socialMediaLink: '',
        mainSourceIncome: '',
        monthlyIncome: '',
        images: [],
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
        mainSourceIncome: Yup.string().required('Nguồn thu nhập chính không được để trống'),
        monthlyIncome: Yup.number()
            .typeError('Thu nhập hàng tháng phải là số')
            .min(0, 'Thu nhập hàng tháng không được âm')
            .required('Thu nhập hàng tháng không được để trống'),
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

    const onSubmit = async (values: PersonalDonor, helpers: FormikHelpers<PersonalDonor>) => {
        dispatch(setLoading(true));
        await dispatch(createPersonalDonorCertificateApiThunk(values)).unwrap().then(() => {
            toast.success("Nộp chứng chỉ thành công");
            setIsOpen(false);
            navigateHook(`${routes.user.personal}?tab=chungchi`);
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

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="personal-donor-modal">
                <div className="pdm-container">
                    <h1>Xác minh tài khoản cá nhân</h1>
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
                                    <label className="form-label">Liên kết Mạng Xã Hội</label>
                                    <Field name="socialMediaLink" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.socialMediaLink && touched.socialMediaLink })} />
                                    {errors.socialMediaLink && touched.socialMediaLink && <span className="text-error">{errors.socialMediaLink}</span>}
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
                                                    style={{ width: "100px", height: "100px", marginRight: "8px", borderRadius: "5px" }}
                                                />
                                            </div>
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

export default PersonalDonorModal