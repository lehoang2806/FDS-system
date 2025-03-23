import { FC } from 'react'
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

    const initialValues: PersonalDonor = {
        citizenId: '',
    };

    const schema = Yup.object().shape({
        citizenId: Yup.string()
            .required('Citizen ID is required')
            .matches(/^\d+$/, 'Citizen ID must be a number')
            .min(9, 'Citizen ID must be at least 9 characters')
            .max(12, 'Citizen ID must be at most 12 characters'),
    });

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
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Personal Donor">
            <section id="personal-donor-modal">
                <div className="pdm-container">
                    <h1>Trở thành tài khoản cá nhân</h1>
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

export default PersonalDonorModal