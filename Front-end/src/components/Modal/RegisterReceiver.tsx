import { useAppDispatch } from '@/app/store';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { FC } from 'react';
import Modal from './Modal';
import { get } from 'lodash';
import { RegisterReceiverModalProps } from './type';
import { createRegisterReceiverApiThunk, getAllRegisterReceiversApiThunk } from '@/services/registerReceive/registerReceiveThunk';

const RegisterReceiverModal: FC<RegisterReceiverModalProps> = ({ isOpen, setIsOpen, campaignId, limitedQuantity }) => {
    const dispatch = useAppDispatch();

    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();

    const initialValues: CreateRegisterReceiver = {
        registerReceiverName: '',
        quantity: 0,
        creatAt: new Date(localDate.getTime() - offset * 60000).toISOString(),
        campaignId: campaignId
    };

    const schema = Yup.object().shape({
        registerReceiverName: Yup.string()
            .trim()
            .min(3, 'Tên phải có ít nhất 3 ký tự')
            .max(50, 'Tên không được quá 50 ký tự')
            .required('Vui lòng nhập tên'),

        quantity: Yup.number()
            .typeError('Số lượng phải là số')
            .integer('Số lượng phải là số nguyên')
            .min(1, 'Số lượng phải lớn hơn 0')
            .max(limitedQuantity, `Số lượng không được vượt quá ${limitedQuantity}`)
            .required('Vui lòng nhập số lượng'),
    });

    const onSubmit = async (values: CreateRegisterReceiver, helpers: FormikHelpers<CreateRegisterReceiver>) => {
        await dispatch(createRegisterReceiverApiThunk(values)).unwrap().then(() => {
            toast.success("Đăng ký nhận quà thành công");
            setIsOpen(false);
            dispatch(getAllRegisterReceiversApiThunk());
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ registerReceiverName: errorData });
            toast.error(errorData);
        }).finally(() => {
            helpers.setSubmitting(false);
        });
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Recipient Certificate">
            <section id="recipient-certificate-modal">
                <div className="rcm-container">
                    <h1>Đăng ký nhận quà</h1>
                    <p>Mỗi người chỉ được đăng ký không quá {limitedQuantity} phần quà</p>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={schema}
                    >
                        {({
                            handleSubmit,
                            errors,
                            touched,
                            isSubmitting
                        }) => (
                            <Form onSubmit={handleSubmit} className="form">
                                <div className="form-field">
                                    <label className="form-label">Tên người nhận quà</label>
                                    <Field name="registerReceiverName" type="text" placeholder="Hãy nhập tên của bạn" className={classNames("form-input", { "is-error": errors.registerReceiverName && touched.registerReceiverName })} />
                                    {errors.registerReceiverName && touched.registerReceiverName && <span className="error">{errors.registerReceiverName}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Số lượng muốn nhận</label>
                                    <Field name="quantity" type="number" placeholder="Hãy nhập tên của bạn" className={classNames("form-input", { "is-error": errors.quantity && touched.quantity })} />
                                    {errors.quantity && touched.quantity && <span className="error">{errors.quantity}</span>}
                                </div>
                                <Button loading={isSubmitting} type="submit" title="Nộp chứng chỉ" />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default RegisterReceiverModal