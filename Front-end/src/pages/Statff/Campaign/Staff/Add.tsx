import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { ChangeEvent, FC } from "react"
import classNames from "classnames";
import Button from "@/components/Elements/Button";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useAppDispatch } from "@/app/store";
import { addCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { toast } from "react-toastify";
import { get } from "lodash";
import { format } from "date-fns";

const StaffAddCampaignStaffPage: FC = () => {
    const dispatch = useAppDispatch();

    const initialValues: AddCampaign = {
        nameCampaign: "",
        description: "",
        giftType: "",
        giftQuantity: 0,
        address: "",
        receiveDate: "",
        limitedQuantity: 0
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

        limitedQuantity: Yup.number()
            .required("Số lượng giới hạn nhận quà không được để trống")
            .min(1, "Số lượng giới hạn nhận quà phải lớn hơn 0"),
    });

    const onSubmit = async (values: AddCampaign, helpers: FormikHelpers<AddCampaign>) => {
        const localDate = new Date(values.receiveDate);
        const offset = localDate.getTimezoneOffset();

        const formattedValues = {
            ...values,
            receiveDate: new Date(localDate.getTime() - offset * 60000).toISOString(),
        };

        await dispatch(addCampaignApiThunk(formattedValues)).unwrap().then(() => {
            toast.success("Add Campaign successfully");
            helpers.resetForm();
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ nameCampaign: errorData });
        }).finally(() => {
            helpers.setSubmitting(false);
        });
    };

    return (
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
                setFieldValue
            }) => (
                <Form onSubmit={handleSubmit}>
                    <section id="staff-add-campaign-staff" className="staff-section">
                        <div className="staff-container sacs-container">
                            <div className="sacscr1">
                                <h1>Staff</h1>
                                <p>Dashboard<span className="staff-tag">Add Staff</span></p>
                            </div>
                            <div className="sacscr2">
                                <div className="sacscr2r1">
                                    <div className="group-btn">
                                        <button onClick={() => navigateHook(routes.staff.campaign.staff.list)}>Cancel</button>
                                        <Button type="submit" title="Create Campaign" loading={isSubmitting} />
                                    </div>
                                </div>
                                <hr />
                                <div className="sacscr2r2">
                                    <div className="sacscr2r2c1">
                                        <h3>Campaign Status:</h3>
                                        <p>Pending</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="sacscr2r3">
                                    <div className="form">
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
                                            <label className="form-label">Số lượng giới hạn cho từng người nhận</label>
                                            <Field name="limitedQuantity" type="number" placeholder="Hãy nhập số lượng giới hạn nhận quà" className={classNames("form-input", { "is-error": errors.limitedQuantity && touched.limitedQuantity })} />
                                            {errors.limitedQuantity && touched.limitedQuantity && <span className="text-error">{errors.limitedQuantity}</span>}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </Form>
            )
            }
        </Formik >
    )
}

export default StaffAddCampaignStaffPage