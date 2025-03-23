import { useAppDispatch } from '@/app/store';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { AddRecipientCertificate } from '@/types/user';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { createRecipientCertificateApiThunk, getAllRecipientCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { FC } from 'react';
import { RecipientCertificateModalProps } from './type';
import Modal from './Modal';
import { get } from 'lodash';
import { setLoading } from '@/services/app/appSlice';

const RecipientCertificateModal: FC<RecipientCertificateModalProps> = ({isOpen, setIsOpen}) => {
    const dispatch = useAppDispatch();

    const initialValues: AddRecipientCertificate = {
        citizenId: '',
    };

    const schema = Yup.object().shape({
        citizenId: Yup.string()
            .required('Citizen ID is required')
            .matches(/^\d+$/, 'Citizen ID must be a number')
            .min(9, 'Citizen ID must be at least 9 characters')
            .max(12, 'Citizen ID must be at most 12 characters'),
    });

    const onSubmit = async (values: AddRecipientCertificate, helpers: FormikHelpers<AddRecipientCertificate>) => {
        dispatch(setLoading(true));
        await dispatch(createRecipientCertificateApiThunk(values)).unwrap().then(() => {
            toast.success("Nộp chứng chỉ thành công");
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
                            isSubmitting
                        }) => (
                            <Form onSubmit={handleSubmit} className="form">
                                <div className="form-field">
                                    <label className="form-label">Căn cước công dân</label>
                                    <Field name="citizenId" type="text" placeholder="Hãy nhập CCCD của bạn" className={classNames("form-input", { "is-error": errors.citizenId && touched.citizenId })} />
                                    {errors.citizenId && touched.citizenId && <span className="error">{errors.citizenId}</span>}
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

export default RecipientCertificateModal