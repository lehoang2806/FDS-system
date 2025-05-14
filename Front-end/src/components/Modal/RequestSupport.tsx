import { FC, useState } from 'react'
import Modal from './Modal'
import { CreateRequestSupportModalProps } from './type'
import { useAppDispatch, useAppSelector } from '@/app/store';
import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import Button from '../Elements/Button';
import classNames from "classnames";
import { setLoading } from '@/services/app/appSlice';
import { selectUserLogin } from '@/app/selector';
import { createRequestSupportApiThunk } from '@/services/requestSupport/requestSupportThunk';
import axios from 'axios';
import Lightbox from 'react-awesome-lightbox';

const CreateRequestSupportModal: FC<CreateRequestSupportModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();
    const userLogin = useAppSelector(selectUserLogin);
    const [imageCCCDPreview, setImageCCCDPreview] = useState<string[]>([]);
    const [lightboxCCCDIndex, setLightboxCCCDIndex] = useState<number | null>(null);
    const [imageCircumstancePreview, setImageCircumstancePreview] = useState<string[]>([]);
    const [lightboxCircumstanceIndex, setLightboxCircumstanceIndex] = useState<number | null>(null);

    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dehc2ftiv/image/upload';
    const UPLOAD_PRESET = 'fds_system';

    const initialValues: RequestSupportActions = {
        fullName: userLogin?.fullName || '',
        email: userLogin?.email || '',
        phoneNumber: userLogin?.phone || '',
        address: userLogin?.address || '',
        dateOfBirth: userLogin?.birthDay || '',
        citizenIdImages: [],
        reason: '',
        householdSize: 0,
        specialMembers: [],
        circumstanceImages: [],
        requestedItems: [],
        desiredQuantity: 0,
    };

    const schema = Yup.object().shape({
        fullName: Yup.string().required('Họ và tên không được để trống'),
        email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
        phoneNumber: Yup.string().required('Số điện thoại không được để trống'),
        address: Yup.string().required('Địa chỉ không được để trống'),
        dateOfBirth: Yup.string().required('Ngày sinh không được để trống'),
        citizenIdImages: Yup.array().of(Yup.string()).min(1, 'Vui lòng tải lên ít nhất 1 ảnh CMND/CCCD'),
        reason: Yup.string().required('Lý do cần hỗ trợ không được để trống'),
        householdSize: Yup.number().min(1, 'Số lượng thành viên phải lớn hơn 0').required('Số lượng thành viên không được để trống'),
        circumstanceImages: Yup.array().of(Yup.string()),
        requestedItems: Yup.array().of(Yup.string()).min(1, 'Vui lòng chọn ít nhất 1 mục cần hỗ trợ'),
        desiredQuantity: Yup.number().min(1, 'Số lượng cần hỗ trợ phải lớn hơn 0').required('Số lượng cần hỗ trợ không được để trống'),
    });

    const onSubmit = async (values: RequestSupportActions, helpers: FormikHelpers<RequestSupportActions>) => {

        try {
            await dispatch(createRequestSupportApiThunk(values)).unwrap();
            toast.success("Yêu cầu hỗ trợ thành công");
            dispatch(setLoading(true));
            dispatch(getAllCampaignApiThunk());
        } catch (error) {
            const errorData = get(error, "data.message", "An error occurred");
            helpers.setErrors({ fullName: errorData });
        } finally {
            helpers.setSubmitting(false);
            setIsOpen(false);
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000);
        }
    };

    const handleResetForm = (resetForm: Function) => {
        resetForm(); // Reset Formik form fields
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: Function, setImagePreview: Function) => {
        const files = Array.from(e.target.files || []);
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setImagePreview(previewUrls); // Hiển thị preview ảnh

        try {
            const uploadedUrls = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', UPLOAD_PRESET);

                    const res = await axios.post(CLOUDINARY_URL, formData);
                    return res.data.secure_url;
                })
            );

            setFieldValue("citizenIdImages", uploadedUrls); // Lưu URL ảnh thực tế vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

    const handleFileCircumstanceChange = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: Function, setImagePreview: Function) => {
        const files = Array.from(e.target.files || []);
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setImagePreview(previewUrls); // Hiển thị preview ảnh

        try {
            const uploadedUrls = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', UPLOAD_PRESET);

                    const res = await axios.post(CLOUDINARY_URL, formData);
                    return res.data.secure_url;
                })
            );

            setFieldValue("circumstanceImages", uploadedUrls); // Lưu URL ảnh thực tế vào Formik
        } catch (err) {
            console.error("Upload thất bại:", err);
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="create-campaign-modal">
                <div className="ccm-container">
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
                            resetForm,
                            setFieldValue
                        }) => (
                            <Form onSubmit={handleSubmit} className='form'>
                                <h1>Điền thông tin</h1>
                                <h3>Thông tin định danh</h3>
                                <div className="ccm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Họ và tên<span>*</span></label>
                                        <Field name="fullName" type="text" placeholder="Hãy nhập họ và tên" className={classNames("form-input", { "is-error": errors.fullName && touched.fullName })} />
                                        {errors.fullName && touched.fullName && <span className="text-error">{errors.fullName}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Ngày sinh<span>*</span></label>
                                        <Field name="dateOfBirth" type="date" placeholder="Hãy nhập phương thức thực hiện" className={classNames("form-input", { "is-error": errors.dateOfBirth && touched.dateOfBirth })} />
                                        {errors.dateOfBirth && touched.dateOfBirth && <span className="text-error">{errors.dateOfBirth}</span>}
                                    </div>

                                    {/* Upload ảnh CMND/CCCD */}
                                    <div className="form-100 form-field">
                                        <label className="form-label">Mặt trước, mặt sau cảu CCCD<span>*</span></label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileChange(e, setFieldValue, setImageCCCDPreview)}
                                            className={classNames("form-input", { "is-error": errors.citizenIdImages && touched.citizenIdImages })}
                                        />
                                        {errors.citizenIdImages && touched.citizenIdImages && <span className="text-error">{errors.citizenIdImages}</span>}
                                    </div>

                                    {/* Hiển thị ảnh preview */}
                                    {imageCCCDPreview.length > 0 && (
                                        <div className="image-preview-container">
                                            {imageCCCDPreview.map((img, index) => (
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
                                                        onClick={() => setLightboxCCCDIndex(index)} // mở lightbox khi click ảnh
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Hiển thị lightbox khi click vào ảnh preview */}
                                    {lightboxCCCDIndex !== null && (
                                        <Lightbox
                                            images={imageCCCDPreview.map((src) => ({ url: src }))}
                                            startIndex={lightboxCCCDIndex}
                                            onClose={() => setLightboxCCCDIndex(null)}
                                        />
                                    )}
                                </div>
                                <h3>Thông tin liên hệ</h3>
                                <div className="ccm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Số điện thoại<span>*</span></label>
                                        <Field name="phoneNumber" type="text" placeholder="Hãy nhập loại quà tặng" className={classNames("form-input", { "is-error": errors.phoneNumber && touched.phoneNumber })} />
                                        {errors.phoneNumber && touched.phoneNumber && <span className="text-error">{errors.phoneNumber}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Địa chỉ<span>*</span></label>
                                        <Field name="address" type="text" placeholder="Hãy nhập địa chỉ của bạn" className={classNames("form-input", { "is-error": errors.address && touched.address })} />
                                        {errors.address && touched.address && <span className="text-error">{errors.address}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Email<span>*</span></label>
                                        <Field name="email" type="text" placeholder="Hãy nhập email của bạn" className={classNames("form-input", { "is-error": errors.email && touched.email })} />
                                        {errors.email && touched.email && <span className="text-error">{errors.email}</span>}
                                    </div>
                                </div>
                                <h3>Hoàn cảnh và lý do hỗ trợ</h3>
                                <div className="ccm-form-r3">
                                    <div className="form-100 form-field">
                                        <label className="form-label">
                                            Lý do yêu cầu hỗ trợ<span>*</span>
                                        </label>
                                        <Field
                                            as="textarea" // Đây là phần sửa
                                            name="reason"
                                            placeholder="Hãy nhập lý do yêu cầu hỗ trợ"
                                            rows={4}
                                            className={classNames("form-input", {
                                                "is-error": errors.reason && touched.reason
                                            })}
                                        />
                                        {errors.reason && touched.reason && (
                                            <span className="text-error">{errors.reason}</span>
                                        )}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Số người mong muốn hỗ trợ<span>*</span></label>
                                        <Field name="householdSize" type="number" placeholder="Hãy nhập số người trong hộ gia đình" className={classNames("form-input", { "is-error": errors.householdSize && touched.householdSize })} />
                                        {errors.householdSize && touched.householdSize && <span className="text-error">{errors.householdSize}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label" style={{ paddingTop: "8px" }}>
                                            Trường hợp đặc biệt
                                        </label>
                                        <div role="group" aria-labelledby="checkbox-group" className="form-checkbox-group" style={{ paddingTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                            <label>
                                                <Field type="checkbox" name="specialMembers" value="Trẻ em" />
                                                Trẻ em
                                            </label>
                                            <label>
                                                <Field type="checkbox" name="specialMembers" value="Người già" />
                                                Người già
                                            </label>
                                            <label>
                                                <Field type="checkbox" name="specialMembers" value="Người bệnh" />
                                                Người bệnh
                                            </label>
                                        </div>
                                        {errors.specialMembers && touched.specialMembers && (
                                            <span className="text-error">{errors.specialMembers}</span>
                                        )}
                                    </div>

                                    {/* Upload ảnh hoàn cảnh */}
                                    <div className="form-100 form-field">
                                        <label className="form-label">Hình ảnh hoàn cảnh</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileCircumstanceChange(e, setFieldValue, setImageCircumstancePreview)}
                                            className={classNames("form-input", { "is-error": errors.circumstanceImages && touched.circumstanceImages })}
                                        />
                                        {errors.circumstanceImages && touched.circumstanceImages && <span className="text-error">{errors.circumstanceImages}</span>}
                                    </div>

                                    {/* Hiển thị ảnh preview */}
                                    {imageCircumstancePreview.length > 0 && (
                                        <div className="image-preview-container">
                                            {imageCircumstancePreview.map((img, index) => (
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
                                                        onClick={() => setLightboxCircumstanceIndex(index)} // mở lightbox khi click ảnh
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Hiển thị lightbox khi click vào ảnh preview */}
                                    {lightboxCircumstanceIndex !== null && (
                                        <Lightbox
                                            images={imageCircumstancePreview.map((src) => ({ url: src }))}
                                            startIndex={lightboxCircumstanceIndex}
                                            onClose={() => setLightboxCircumstanceIndex(null)}
                                        />
                                    )}
                                </div>
                                <h3>Yêu cầu hỗ trợ</h3>
                                <div className="ccm-form-r3">
                                    <div className="form-100 form-field">
                                        <label className="form-label">Chọn phần quà bạn cần hỗ trợ<span>*</span></label>

                                        {/* Các checkbox mặc định */}
                                        {["Gạo", "Mì tôm", "Nước tương", "Sữa cho trẻ em hoặc người già", "Rau củ quả", "Thực phẩm đóng hộp"].map((item) => (
                                            <label key={item} className="checkbox-label" style={{ display: "block", marginBottom: "4px" }}>
                                                <Field
                                                    type="checkbox"
                                                    name="requestedItems"
                                                    value={item}
                                                    className="form-checkbox"
                                                />
                                                {item}
                                            </label>
                                        ))}

                                        {/* Phần nhập khác */}
                                        <div style={{ marginTop: "8px" }}>
                                            <Field name="otherItem">
                                                {({ field, form }: any) => (
                                                    <div>
                                                        <input
                                                            {...field}
                                                            type="text"
                                                            placeholder="Nhập phần quà khác nếu có"
                                                            className={classNames("form-input", {
                                                                "is-error": errors.requestedItems && touched.requestedItems,
                                                            })}
                                                            onBlur={(e) => {
                                                                field.onBlur(e);
                                                                // Nếu có nhập nội dung thì thêm vào requestedItems
                                                                if (e.target.value.trim()) {
                                                                    const currentItems = form.values.requestedItems || [];
                                                                    if (!currentItems.includes(e.target.value.trim())) {
                                                                        form.setFieldValue('requestedItems', [...currentItems, e.target.value.trim()]);
                                                                    }
                                                                    // Xóa ô input sau khi thêm
                                                                    form.setFieldValue('otherItem', '');
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Field>
                                        </div>

                                        {/* Hiển thị lỗi */}
                                        {errors.requestedItems && touched.requestedItems && (
                                            <span className="text-error">{errors.requestedItems}</span>
                                        )}

                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label" style={{ paddingTop: "8px" }}>Số lượng phần quà mong muốn <span>*</span></label>
                                        <Field name="desiredQuantity" type="text" placeholder="" className={classNames("form-input", { "is-error": errors.desiredQuantity && touched.desiredQuantity })} />
                                        {errors.desiredQuantity && touched.desiredQuantity && <span className="text-error">{errors.desiredQuantity}</span>}
                                    </div>
                                </div>
                                <div className="group-btn">
                                    <div className="pr-btn" onClick={() => handleResetForm(resetForm)}>
                                        Làm mới
                                    </div>
                                    <Button type="submit" title="Gửi" loading={isSubmitting} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default CreateRequestSupportModal;
