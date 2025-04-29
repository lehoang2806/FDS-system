import { FC } from 'react'
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

const CreateRequestSupportModal: FC<CreateRequestSupportModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();
    const userLogin = useAppSelector(selectUserLogin);

    const initialValues: RequestSupportActions = {
        fullName: userLogin?.fullName || '',
        email: userLogin?.email || '',
        phoneNumber: userLogin?.phone || '',
        address: userLogin?.address || '',
        dateOfBirth: userLogin?.birthDay || '',
        localAuthorityContact: '',
        relativeContact: '',
        citizenId: '',
        citizenIdImages: [],
        reason: '',
        householdSize: 0,
        specialMembers: '',
        incomeSource: '',
        monthlyIncome: 0,
        circumstanceImages: [],
        localAuthorityConfirmation: '',
        requestedItems: [],
        createdDate: new Date().toISOString(),
        images: [],
        hasReceivedSupportBefore: true,
        previousSupportDetails: '',
        commitmentToAccuracy: true,
        signatureImage: '',
    };

    const schema = Yup.object().shape({
        fullName: Yup.string().required('Họ và tên không được để trống'),
        email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
        phoneNumber: Yup.string().required('Số điện thoại không được để trống'),
        address: Yup.string().required('Địa chỉ không được để trống'),
        dateOfBirth: Yup.string().required('Ngày sinh không được để trống'),
        localAuthorityContact: Yup.string().required('Thông tin liên hệ chính quyền địa phương không được để trống'),
        relativeContact: Yup.string().required('Thông tin người thân không được để trống'),
        citizenId: Yup.string().required('CMND/CCCD không được để trống'),
        citizenIdImages: Yup.array().of(Yup.string()).min(1, 'Vui lòng tải lên ít nhất 1 ảnh CMND/CCCD'),
        reason: Yup.string().required('Lý do cần hỗ trợ không được để trống'),
        householdSize: Yup.number().min(1, 'Số lượng thành viên phải lớn hơn 0').required('Số lượng thành viên không được để trống'),
        incomeSource: Yup.string().required('Nguồn thu nhập không được để trống'),
        monthlyIncome: Yup.number().min(0, 'Thu nhập không hợp lệ').required('Thu nhập hàng tháng không được để trống'),
        circumstanceImages: Yup.array().of(Yup.string()),
        requestedItems: Yup.array().of(Yup.string()).min(1, 'Vui lòng chọn ít nhất 1 mục cần hỗ trợ'),
        createdDate: Yup.string().required(),
        hasReceivedSupportBefore: Yup.boolean().required(),
        previousSupportDetails: Yup.string(),
        commitmentToAccuracy: Yup.boolean()
            .oneOf([true], 'Bạn phải cam kết rằng thông tin chính xác')
            .required('Bạn phải cam kết rằng thông tin chính xác'),
        signatureImage: Yup.string().required('Chữ ký không được để trống'),
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any, fieldName: string, single = false) => {
        const files = event.target.files;
        if (!files) return;

        const promises = Array.from(files).map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        const base64Files = await Promise.all(promises);

        if (single) {
            setFieldValue(fieldName, base64Files[0]);
        } else {
            setFieldValue(fieldName, base64Files);
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
                            values,
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
                                    {/* CMND/CCCD */}
                                    <div className="form-50 form-field">
                                        <label className="form-label">Số CMND/CCCD<span>*</span></label>
                                        <Field
                                            name="citizenId"
                                            type="text"
                                            placeholder="Nhập số CMND/CCCD"
                                            className={classNames("form-input", { "is-error": errors.citizenId && touched.citizenId })}
                                        />
                                        {errors.citizenId && touched.citizenId && <span className="text-error">{errors.citizenId}</span>}
                                    </div>

                                    {/* Upload ảnh CMND/CCCD */}
                                    <div className="form-50 form-field">
                                        <label className="form-label">Ảnh CMND/CCCD<span>*</span></label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className={classNames("form-input", { "is-error": errors.citizenIdImages && touched.citizenIdImages })}
                                            onChange={(event) => handleFileUpload(event, setFieldValue, 'citizenIdImages')}
                                        />
                                        {/* Preview hình */}
                                        {values.citizenIdImages?.map((img, index) => (
                                            <img key={index} src={img} alt="CMND/CCCD" style={{ width: '100px', marginRight: '8px' }} />
                                        ))}
                                    </div>
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
                                    {/* Thông tin liên hệ chính quyền */}
                                    <div className="form-50 form-field">
                                        <label className="form-label">Thông tin liên hệ chính quyền địa phương<span>*</span></label>
                                        <Field
                                            name="localAuthorityContact"
                                            type="text"
                                            placeholder="Nhập thông tin liên hệ"
                                            className={classNames("form-input", { "is-error": errors.localAuthorityContact && touched.localAuthorityContact })}
                                        />
                                        {errors.localAuthorityContact && touched.localAuthorityContact && <span className="text-error">{errors.localAuthorityContact}</span>}
                                    </div>

                                    {/* Thông tin liên hệ người thân */}
                                    <div className="form-50 form-field">
                                        <label className="form-label">Thông tin liên hệ người thân<span>*</span></label>
                                        <Field
                                            name="relativeContact"
                                            type="text"
                                            placeholder="Nhập thông tin người thân"
                                            className={classNames("form-input", { "is-error": errors.relativeContact && touched.relativeContact })}
                                        />
                                        {errors.relativeContact && touched.relativeContact && <span className="text-error">{errors.relativeContact}</span>}
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
                                        <label className="form-label">Số người trong hộ gia đình<span>*</span></label>
                                        <Field name="householdSize" type="number" placeholder="Hãy nhập số người trong hộ gia đình" className={classNames("form-input", { "is-error": errors.householdSize && touched.householdSize })} />
                                        {errors.householdSize && touched.householdSize && <span className="text-error">{errors.householdSize}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label" style={{ paddingTop: "8px" }}>Trẻ em/ Người già/ Người bệnh(Nếu có)</label>
                                        <Field name="specialMembers" type="text" placeholder="" className={classNames("form-input", { "is-error": errors.specialMembers && touched.specialMembers })} />
                                        {errors.specialMembers && touched.specialMembers && <span className="text-error">{errors.specialMembers}</span>}
                                    </div>
                                    {/* Xác nhận chính quyền */}
                                    <div className="form-100 form-field">
                                        <label className="form-label">Đường dẫn đến giấy xác nhận của chính quyền địa phương (nếu có)</label>
                                        <Field
                                            type="text"
                                            name="localAuthorityConfirmation"
                                            placeholder="Nhập xác nhận"
                                            className={classNames("form-input", { "is-error": errors.localAuthorityConfirmation && touched.localAuthorityConfirmation })}
                                        />
                                        {errors.localAuthorityConfirmation && touched.localAuthorityConfirmation && <span className="text-error">{errors.localAuthorityConfirmation}</span>}
                                    </div>

                                    {/* Upload ảnh hoàn cảnh */}
                                    <div className="form-100 form-field">
                                        <label className="form-label">Ảnh hoàn cảnh hiện tại</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className={classNames("form-input", { "is-error": errors.circumstanceImages && touched.circumstanceImages })}
                                            onChange={(event) => handleFileUpload(event, setFieldValue, 'circumstanceImages')}
                                        />
                                        {values.circumstanceImages?.map((img, index) => (
                                            <img key={index} src={img} alt="Circumstance" style={{ width: '100px', marginRight: '8px' }} />
                                        ))}
                                    </div>
                                </div>
                                <h3>Thông tin tài chính</h3>
                                <div className="ccm-form-r3">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Nguồn thu nhập hiện tại<span>*</span></label>
                                        <Field name="incomeSource" type="text" placeholder="Hãy nhập nguồn thu nhập hiện tại" className={classNames("form-input", { "is-error": errors.incomeSource && touched.incomeSource })} />
                                        {errors.incomeSource && touched.incomeSource && <span className="text-error">{errors.incomeSource}</span>}
                                    </div>
                                    {/* Thu nhập hàng tháng */}
                                    <div className="form-50 form-field">
                                        <label className="form-label">Thu nhập hàng tháng<span>*</span></label>
                                        <Field
                                            name="monthlyIncome"
                                            type="number"
                                            placeholder="Nhập thu nhập hàng tháng"
                                            className={classNames("form-input", { "is-error": errors.monthlyIncome && touched.monthlyIncome })}
                                        />
                                        {errors.monthlyIncome && touched.monthlyIncome && <span className="text-error">{errors.monthlyIncome}</span>}
                                    </div>
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

                                </div>
                                <h3>Lịch sử nhận hỗ trợ</h3>
                                <div className="ccm-form-r3">
                                    {/* Đã từng nhận hỗ trợ chưa */}
                                    <div className="form-100 form-field">
                                        <label className="form-label">
                                            <Field type="checkbox" name="hasReceivedSupportBefore" />
                                            Bạn đã từng nhận hỗ trợ trước đây?
                                        </label>
                                    </div>

                                    {/* Nếu đã từng hỗ trợ, nhập chi tiết */}
                                    {values.hasReceivedSupportBefore && (
                                        <div className="form-100 form-field">
                                            <label className="form-label">Chi tiết hỗ trợ trước đây</label>
                                            <Field
                                                as="textarea"
                                                name="previousSupportDetails"
                                                placeholder="Nhập chi tiết"
                                                rows={4}
                                                className="form-input"
                                            />
                                        </div>
                                    )}
                                </div>
                                <h3>Cam kết minh bạch</h3>
                                <div className="ccm-form-r3">
                                    {/* Cam kết thông tin chính xác */}
                                    <div className="form-100 form-field">
                                        <label className="form-label">
                                            <Field type="checkbox" name="commitmentToAccuracy" />
                                            Tôi cam kết những thông tin đã cung cấp là hoàn toàn chính xác
                                        </label>
                                        {errors.commitmentToAccuracy && touched.commitmentToAccuracy && <span className="text-error">{errors.commitmentToAccuracy}</span>}
                                    </div>

                                    {/* Upload chữ ký */}
                                    <div className="form-100 form-field">
                                        <label className="form-label">Ảnh chữ ký<span>*</span></label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className='form-input'
                                            onChange={(event) => handleFileUpload(event, setFieldValue, 'signatureImage', true)}
                                        />
                                        {values.signatureImage && (
                                            <img src={values.signatureImage} alt="Signature" style={{ width: '100px' }} />
                                        )}
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
