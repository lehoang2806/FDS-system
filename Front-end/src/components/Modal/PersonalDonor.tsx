import { ChangeEvent, FC, useState } from 'react'
import Modal from './Modal'
import { useAppDispatch } from '@/app/store'
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

const PersonalDonorModal: FC<PersonalDonorModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const initialValues: PersonalDonor = {
        citizenId: '',
        images: [],
    };

    const schema = Yup.object().shape({
        citizenId: Yup.string()
            .required('Citizen ID is required')
            .matches(/^\d+$/, 'Citizen ID must be a number')
            .min(9, 'Citizen ID must be at least 9 characters')
            .max(12, 'Citizen ID must be at most 12 characters'),
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
                    <h1>Trở thành tài khoản cá nhân</h1>
                    <h2>Các ảnh cần nộp để xác nhận danh tính:</h2>
                    <h3>Giấy tờ tùy thân:</h3>
                    <ul>
                        <li>Cung cấp ảnh chụp CMND/CCCD/Hộ chiếu để xác minh danh tính.</li>
                    </ul>
                    <h3>Hình ảnh hoạt động từ thiện:</h3>
                    <ul>
                        <li>Cung cấp ảnh chụp cá nhân đang tham gia hoạt động từ thiện, như phát quà, giúp đỡ người khó khăn.</li>
                        <li>Hình ảnh nên rõ ràng, có thể kèm theo ngày tháng và địa điểm nếu có.</li>
                    </ul>
                    <h3>Chứng nhận từ tổ chức (nếu có):</h3>
                    <ul>
                        <li>Nếu cá nhân hợp tác với tổ chức, có thể bổ sung giấy xác nhận từ tổ chức đó.</li>
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
                                <div className="form-field">
                                    <label className="form-label">Căn cước công dân</label>
                                    <Field name="citizenId" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.citizenId && touched.citizenId })} />
                                    {errors.citizenId && touched.citizenId && <span className="error">{errors.citizenId}</span>}
                                </div>
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

export default PersonalDonorModal