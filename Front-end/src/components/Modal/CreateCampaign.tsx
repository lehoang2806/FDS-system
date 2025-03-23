import { ChangeEvent, FC } from 'react'
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
import { format } from "date-fns";

const CreateCampaignModal: FC<CreateCampaignModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();

    const initialValues: AddCampaign = {
        nameCampaign: "",
        description: "",
        giftType: "",
        giftQuantity: 0,
        address: "",
        receiveDate: "",
        startRegisterDate: "",
        endRegisterDate: "",
        image: "",
        typeCampaign: ""
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
            .nullable()
            .when("typeCampaign", {
                is: "Limited",
                otherwise: (schema) => schema.notRequired().nullable(),
            }),

        address: Yup.string()
            .required("Địa chỉ không được để trống"),

        receiveDate: Yup.string()
            .required("Ngày nhận không được để trống")
            .test("is-future-date", "Ngày nhận phải sau ít nhất 2 ngày kể từ hôm nay", (value) => {
                if (!value) return false;
                const selectedDate = moment(value);
                const minDate = moment().add(2, "days").startOf("day");
                return selectedDate.isAfter(minDate);
            }),

        startRegisterDate: Yup.date()
            .nullable()
            .when("typeCampaign", {
                is: "Voluntary",
                otherwise: (schema) => schema.notRequired(),
            }),

        endRegisterDate: Yup.date()
            .nullable()
            .when("typeCampaign", {
                is: "Voluntary",
                then: (schema) =>
                    schema
                        .test(
                            "is-before-receiveDate",
                            "Ngày kết thúc đăng ký phải trước ngày nhận quà",
                            function (value) {
                                if (!value || !this.parent.receiveDate) return true; // Bỏ qua nếu không có giá trị
                                return new Date(value).getTime() < new Date(this.parent.receiveDate).getTime();
                            }
                        ),
            }),


        image: Yup.string()
            .required("Hình ảnh là bắt buộc"),

        typeCampaign: Yup.string()
            .required("Loại chiến dịch là bắt buộc")
    });

    const onSubmit = async (values: AddCampaign, helpers: FormikHelpers<AddCampaign>) => {
        // Chuyển từng giá trị Date riêng lẻ
        const toUTC = (dateStr: string) => {
            const localDate = new Date(dateStr);
            const offset = localDate.getTimezoneOffset();
            return new Date(localDate.getTime() - offset * 60000).toISOString();
        };

        const formattedValues = {
            ...values,
            receiveDate: toUTC(values.receiveDate),
            startRegisterDate: toUTC(values.startRegisterDate),
            endRegisterDate: toUTC(values.endRegisterDate),
        };

        await dispatch(addCampaignApiThunk(formattedValues))
            .unwrap()
            .then(() => {
                toast.success("Add Campaign successfully");
                dispatch(getAllCampaignApiThunk());
            })
            .catch((error) => {
                const errorData = get(error, "data.message", null);
                helpers.setErrors({ nameCampaign: errorData });
            })
            .finally(() => {
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
                            isSubmitting,
                            values,
                            setFieldValue,
                        }) => (
                            <Form onSubmit={handleSubmit} className='form'>
                                <div className="form-field">
                                    <label className="form-label">Tên chiến dịch</label>
                                    <Field name="nameCampaign" type="text" placeholder="Hãy nhập tên chiến dịch" className={classNames("form-input", { "is-error": errors.nameCampaign && touched.nameCampaign })} />
                                    {errors.nameCampaign && touched.nameCampaign && <span className="text-error">{errors.nameCampaign}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Mô tả</label>
                                    <Field name="description" type="text" placeholder="Hãy nhập mô tả về chiến dịch" className={classNames("form-input", { "is-error": errors.description && touched.description })} />
                                    {errors.description && touched.description && <span className="text-error">{errors.description}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Loại quà tặng</label>
                                    <Field name="giftType" type="text" placeholder="Hãy nhập loại quà tặng" className={classNames("form-input", { "is-error": errors.giftType && touched.giftType })} />
                                    {errors.giftType && touched.giftType && <span className="text-error">{errors.giftType}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Địa chỉ</label>
                                    <Field name="address" type="text" placeholder="Hãy nhập điểm nhận quà tặng" className={classNames("form-input", { "is-error": errors.address && touched.address })} />
                                    {errors.address && touched.address && <span className="text-error">{errors.address}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Thời gian và ngày nhận quà</label>
                                    <Field
                                        name="receiveDate"
                                        type="datetime-local"
                                        value={values.receiveDate ? format(new Date(values.receiveDate), "yyyy-MM-dd'T'HH:mm") : ""}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFieldValue("receiveDate", e.target.value)}
                                        className={classNames("form-input", { "is-error": errors.receiveDate && touched.receiveDate })}
                                    />
                                    {errors.receiveDate && touched.receiveDate && <span className="text-error">{errors.receiveDate}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Ảnh</label>
                                    <Field name="image" type="file" placeholder="Hãy nhập điểm nhận quà tặng" className={classNames("form-input", { "is-error": errors.image && touched.image })} />
                                    {errors.image && touched.image && <span className="text-error">{errors.image}</span>}
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Loại chiến dịch</label>
                                    <Field
                                        as="select"
                                        name="typeCampaign"
                                        className="form-input"
                                        value={values.typeCampaign}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                            const newValue = e.target.value;
                                            setFieldValue("typeCampaign", newValue);
                                            console.log(newValue);
                                        }}
                                    >
                                        <option value="">Chọn loại chiến dịch</option>
                                        <option value="Limited">Số lượng giới hạn</option>
                                        <option value="Voluntary">Đăng ký theo nguyện vọng</option>
                                    </Field>
                                </div>
                                {values.typeCampaign === "Limited" && (
                                    <div className="form-field">
                                        <label className="form-label">Số lượng giới hạn</label>
                                        <Field name="giftQuantity" type="number" placeholder="Nhập số lượng" className="form-input" />
                                        {errors.giftQuantity && touched.giftQuantity && <span className="text-error">{errors.giftQuantity}</span>}
                                    </div>
                                )}

                                {values.typeCampaign === "Voluntary" && (
                                    <>
                                        <div className="form-field">
                                            <label className="form-label">Ngày mở đăng ký</label>
                                            <Field name="startRegisterDate" type="datetime-local" className="form-input" />
                                            {errors.startRegisterDate && touched.startRegisterDate && <span className="text-error">{errors.startRegisterDate}</span>}
                                        </div>

                                        <div className="form-field">
                                            <label className="form-label">Ngày đóng đăng ký</label>
                                            <Field name="endRegisterDate" type="datetime-local" className="form-input" />
                                            {errors.endRegisterDate && touched.endRegisterDate && <span className="text-error">{errors.endRegisterDate}</span>}
                                        </div>
                                    </>
                                )}
                                <Button type="submit" title="Tạo chiến dịch" loading={isSubmitting} />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default CreateCampaignModal;
