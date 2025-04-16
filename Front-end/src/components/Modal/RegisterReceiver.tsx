import { useAppDispatch, useAppSelector } from '@/app/store';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';
import { FC, useEffect } from 'react';
import Modal from './Modal';
import { get } from 'lodash';
import { RegisterReceiverModalProps } from './type';
import { createRegisterReceiverApiThunk, getAllRegisterReceiversApiThunk } from '@/services/registerReceive/registerReceiveThunk';
import { setLoading } from '@/services/app/appSlice';
import { selectGetAllRegisterReceivers } from '@/app/selector';

const RegisterReceiverModal: FC<RegisterReceiverModalProps> = ({ isOpen, setIsOpen, campaign }) => {
    const dispatch = useAppDispatch();

    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();

    const registerReceivers = useAppSelector(selectGetAllRegisterReceivers);
    const currentRegisterReceivers = registerReceivers.filter((registerReceiver) => registerReceiver.campaignId === campaign?.campaignId);
    const totalRegisteredQuantity = currentRegisterReceivers.reduce((sum, receiver) => sum + (receiver.quantity || 0), 0);

    useEffect(() => {
        if (campaign?.campaignId) {
            dispatch(getAllRegisterReceiversApiThunk())
                .unwrap()
                .catch(() => {
                }).finally(() => {
                });
        }
    }, [dispatch])

    const initialValues: CreateRegisterReceiver = {
        registerReceiverName: '',
        quantity: 0,
        creatAt: new Date(localDate.getTime() - offset * 60000).toISOString(),
        campaignId: campaign?.campaignId
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
            .required('Vui lòng nhập số lượng'),
    });

    const onSubmit = async (values: CreateRegisterReceiver, helpers: FormikHelpers<CreateRegisterReceiver>) => {
        dispatch(setLoading(true));
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
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000)
        });
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="register-receiver-modal">
                <div className="rrm-container">
                    <h1>Đăng ký nhận quà</h1>
                    {
                        campaign?.campaignType === "Limited" && (
                            <>
                                <p>Số lượng còn lại: {Number(campaign?.limitedQuantity) - totalRegisteredQuantity}</p>
                            </>
                        )
                    }
                    <p>Số lượng đã đăng ký: {totalRegisteredQuantity}</p>
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
                                    <label className="form-label">Tên người đại diện nhận quà</label>
                                    <Field name="registerReceiverName" type="text" placeholder="Hãy nhập tên của bạn" className={classNames("form-input", { "is-error": errors.registerReceiverName && touched.registerReceiverName })} />
                                    {errors.registerReceiverName && touched.registerReceiverName && <span className="error">{errors.registerReceiverName}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Số lượng muốn nhận</label>
                                    <Field name="quantity" type="number" placeholder="Hãy nhập tên của bạn" className={classNames("form-input", { "is-error": errors.quantity && touched.quantity })} />
                                    {errors.quantity && touched.quantity && <span className="error">{errors.quantity}</span>}
                                </div>
                                <p><span>Ghi chú:</span> Số lượng bạn đăng ký tương ứng với số người có mặt tại địa điểm.</p>
                                <Button loading={isSubmitting} type="submit" title="Đăng ký" />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default RegisterReceiverModal