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
        reason: '',
        householdSize: 0,
        specialMembers: '',
        incomeSource: '',
        requestedItems: [],
        createdDate: new Date().toISOString(),
    };

    const schema = Yup.object().shape({
        fullName: Yup.string()
            .required('Họ và tên không được để trống'),

        email: Yup.string()
            .email('Email không hợp lệ'),

        phoneNumber: Yup.string()
            .matches(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ')
            .required('Số điện thoại không được để trống'),

        address: Yup.string()
            .required('Địa chỉ không được để trống'),

        dateOfBirth: Yup.date()
            .max(new Date(), 'Ngày sinh không hợp lệ')
            .required('Ngày sinh không được để trống'),

        reason: Yup.string()
            .required('Lý do không được để trống'),

        householdSize: Yup.number()
            .min(1, 'Số lượng thành viên phải lớn hơn 0')
            .required('Số lượng thành viên không được để trống'),

        incomeSource: Yup.string()
            .required('Nguồn thu nhập không được để trống'),

        requestedItems: Yup.array()
            .of(Yup.string())
            .min(1, 'Phải chọn ít nhất một phần quà'),
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
                            resetForm
                        }) => (
                            <Form onSubmit={handleSubmit} className='form'>
                                <h1>Điền thông tin</h1>
                                <h3>Thông tin cá nhân</h3>
                                <div className="ccm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Họ và tên<span>*</span></label>
                                        <Field name="fullName" type="text" placeholder="Hãy nhập họ và tên" className={classNames("form-input", { "is-error": errors.fullName && touched.fullName })} />
                                        {errors.fullName && touched.fullName && <span className="text-error">{errors.fullName}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Email<span>*</span></label>
                                        <Field name="email" type="text" placeholder="Hãy nhập email của bạn" className={classNames("form-input", { "is-error": errors.email && touched.email })} />
                                        {errors.email && touched.email && <span className="text-error">{errors.email}</span>}
                                    </div>
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
                                        <label className="form-label">Ngày sinh<span>*</span></label>
                                        <Field name="dateOfBirth" type="date" placeholder="Hãy nhập phương thức thực hiện" className={classNames("form-input", { "is-error": errors.dateOfBirth && touched.dateOfBirth })} />
                                        {errors.dateOfBirth && touched.dateOfBirth && <span className="text-error">{errors.dateOfBirth}</span>}
                                    </div>
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
                                </div>
                                <h3>Tình trạng hiện tại</h3>
                                <div className="ccm-form-r3">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Số người trong hộ gia đình<span>*</span></label>
                                        <Field name="householdSize" type="number" placeholder="Hãy nhập số người trong hộ gia đình" className={classNames("form-input", { "is-error": errors.householdSize && touched.householdSize })} />
                                        {errors.householdSize && touched.householdSize && <span className="text-error">{errors.householdSize}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Trẻ em/ Người già/ Người bệnh(Nếu có)</label>
                                        <Field name="specialMembers" type="text" placeholder="Hãy nhập" className={classNames("form-input", { "is-error": errors.specialMembers && touched.specialMembers })} />
                                        {errors.specialMembers && touched.specialMembers && <span className="text-error">{errors.specialMembers}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Nguồn thu nhập hiện tại<span>*</span></label>
                                        <Field name="incomeSource" type="text" placeholder="Hãy nhập nguồn thu nhập hiện tại" className={classNames("form-input", { "is-error": errors.incomeSource && touched.incomeSource })} />
                                        {errors.incomeSource && touched.incomeSource && <span className="text-error">{errors.incomeSource}</span>}
                                    </div>
                                </div>
                                <div className="form-100 form-field">
                                    <label className="form-label">Chọn phần quà bạn cần hỗ trợ<span>*</span></label>
                                    {["Gạo", "Mì tôm", "Nước tương", "Sửa cho trẻ em hoặc nguời già", "Rau củ quả", "Thực phẩm đóng hộp"].map((item) => (
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
                                    {errors.requestedItems && touched.requestedItems && (
                                        <span className="text-error">{errors.requestedItems}</span>
                                    )}
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
