import { FC } from 'react'
import Modal from './Modal'
import { OrganizationDonorModalProps } from './type'
import { useAppDispatch } from '@/app/store';
import { OrganizationDonor } from '@/types/user';
import * as Yup from "yup";
import Button from '../Elements/Button';
import classNames from "classnames";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { createOrganizationDonorCertificateApiThunk } from '@/services/user/userThunk';
import { toast } from 'react-toastify';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { get } from 'lodash';

const OrganizationDonorModal: FC<OrganizationDonorModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();

    const initialValues: OrganizationDonor = {
        organizationName: '',
        taxIdentificationNumber: '',
    };

    const schema = Yup.object().shape({
        organizationName: Yup.string()
            .required('Organization Name is required'),
        taxIdentificationNumber: Yup.string()
            .required('Tax Identification Number is required'),
    });

    const onSubmit = async (values: OrganizationDonor, helpers: FormikHelpers<OrganizationDonor>) => {
        await dispatch(createOrganizationDonorCertificateApiThunk(values)).unwrap().then(() => {
            toast.success("Nộp chứng chỉ thành công");
            setIsOpen(false);
            navigateHook(`${routes.user.personal}?tab=chungchi`);
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ organizationName: errorData });
            toast.error(errorData);
        }).finally(() => {
            helpers.setSubmitting(false);
        });
    }
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Organization Donor">
            <section id="organization-donor-modal">
                <div className="odm-container">
                    <h1>Đăng ký thành tổ chức ủng hộ</h1>
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
                                    <label className="form-label">Tên tổ chức</label>
                                    <Field name="organizationName" type="text" placeholder="Hãy nhập tên tố chức của bạn" className={classNames("form-input", { "is-error": errors.organizationName && touched.organizationName })} />
                                    {errors.organizationName && touched.organizationName && <span className="error">{errors.organizationName}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Mã số thuế</label>
                                    <Field name="taxIdentificationNumber" type="text" placeholder="Hãy nhập mã số thuế của bạn" className={classNames("form-input", { "is-error": errors.taxIdentificationNumber && touched.taxIdentificationNumber })} />
                                    {errors.taxIdentificationNumber && touched.taxIdentificationNumber && <span className="error">{errors.taxIdentificationNumber}</span>}
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

export default OrganizationDonorModal