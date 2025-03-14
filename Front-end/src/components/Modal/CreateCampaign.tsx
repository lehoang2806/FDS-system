import { FC } from 'react'
import Modal from './Modal'
import { CreateCampaignModalProps } from './type'
import { useAppDispatch } from '@/app/store';
import * as Yup from "yup";
import moment from "moment";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { addCampaignApiThunk, getAllCampaignApiThunk } from '@/services/campaign/campaignThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import Button from '../Elements/Button';
import classNames from "classnames";

const CreateCampaignModal: FC<CreateCampaignModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();

    const initialValues: AddCampaign = {
        nameCampaign: "",
        description: "",
        giftType: "",
        giftQuantity: 0,
        address: "",
        receiveDate: "",
    };

    const schema = Yup.object().shape({
        nameCampaign: Yup.string()
            .required("Tên chiến dịch không được để trống")
            .min(3, "Tên chiến dịch phải có ít nhất 3 ký tự"),

        description: Yup.string()
            .required("Mô tả không được để trống"),

        giftType: Yup.string()
            .required("Loại quà tặng không được để trống"),

        giftQuantity: Yup.number()
            .required("Số lượng quà tặng không được để trống")
            .min(1, "Số lượng quà tặng phải lớn hơn 0"),

        address: Yup.string()
            .required("Địa chỉ không được để trống"),

        receiveDate: Yup.string()
            .required("Ngày nhận không được để trống")
            .test("is-future-date", "Ngày nhận phải sau ít nhất 2 ngày kể từ hôm nay", (value) => {
                if (!value) return false;
                const selectedDate = moment(value, "YYYY-MM-DD");
                const minDate = moment().add(2, "days").startOf("day");
                return selectedDate.isAfter(minDate);
            }),
    });

    const onSubmit = async (values: AddCampaign, helpers: FormikHelpers<AddCampaign>) => {
        await dispatch(addCampaignApiThunk(values)).unwrap().then(() => {
            toast.success("Add Campaign successfully");
            dispatch(getAllCampaignApiThunk());
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ nameCampaign: errorData });
        }).finally(() => {
            helpers.setSubmitting(false);
            setIsOpen(false);
        });
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Tạo chiến dịch">
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
                            isSubmitting
                        }) => (
                            <Form onSubmit={handleSubmit} className='form'> 
                                <div className="form-field">
                                    <label className="form-label">Campaign Name</label>
                                    <Field name="nameCampaign" type="text" placeholder="Hãy nhập tên chiến dịch" className={classNames("form-input", { "is-error": errors.nameCampaign && touched.nameCampaign })} />
                                    {errors.nameCampaign && touched.nameCampaign && <span className="text-error">{errors.nameCampaign}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Description</label>
                                    <Field name="description" type="text" placeholder="Hãy nhập mô tả về chiến dịch" className={classNames("form-input", { "is-error": errors.description && touched.description })} />
                                    {errors.description && touched.description && <span className="text-error">{errors.description}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Gift Quantity</label>
                                    <Field name="giftQuantity" type="number" placeholder="Hãy nhập số lượng phần quà tặng" className={classNames("form-input", { "is-error": errors.giftQuantity && touched.giftQuantity })} />
                                    {errors.giftQuantity && touched.giftQuantity && <span className="text-error">{errors.giftQuantity}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Gift Type</label>
                                    <Field name="giftType" type="text" placeholder="Hãy nhập loại quà tặng" className={classNames("form-input", { "is-error": errors.giftType && touched.giftType })} />
                                    {errors.giftType && touched.giftType && <span className="text-error">{errors.giftType}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Address</label>
                                    <Field name="address" type="text" placeholder="Hãy nhập điểm nhận quà tặng" className={classNames("form-input", { "is-error": errors.address && touched.address })} />
                                    {errors.address && touched.address && <span className="text-error">{errors.address}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Receive Date</label>
                                    <Field name="receiveDate" type="date" placeholder="Hãy nhập ngày nhận quà tặng" className={classNames("form-input", { "is-error": errors.receiveDate && touched.receiveDate })} />
                                    {errors.receiveDate && touched.receiveDate && <span className="text-error">{errors.receiveDate}</span>}
                                </div>
                                <Button type="submit" title="Tạo chiến dịch" loading={isSubmitting} />
                            </Form>
                        )
                        }
                    </Formik >
                </div>
            </section>
        </Modal>
    )
}

export default CreateCampaignModal