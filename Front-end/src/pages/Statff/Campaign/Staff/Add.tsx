import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { ChangeEvent, FC, useState } from "react"
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
import { setLoading } from "@/services/app/appSlice";

const StaffAddCampaignStaffPage: FC = () => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const initialValues: AddCampaign = {
        nameCampaign: "",
        description: "",
        giftType: "",
        giftQuantity: 0,
        address: "",
        receiveDate: "",
        startRegisterDate: "",
        endRegisterDate: "",
        images: [],
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

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const base64Promises = files.map(file => convertToBase64(file));

            try {
                const base64Images = await Promise.all(base64Promises);
                setFieldValue("images", base64Images); // 🔹 Lưu danh sách ảnh vào Formik
                setImagePreview(base64Images); // 🔹 Cập nhật ảnh xem trước
            } catch (error) {
                console.error("Error converting images:", error);
            }
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const onSubmit = async (values: AddCampaign, helpers: FormikHelpers<AddCampaign>) => {
        const toUTC = (dateStr: string) => {
            const localDate = new Date(dateStr);
            const offset = localDate.getTimezoneOffset();
            return new Date(localDate.getTime() - offset * 60000).toISOString();
        };

        const formattedValues: AddCampaign = {
            ...values,
            receiveDate: toUTC(values.receiveDate),
            ...(values.typeCampaign === "Voluntary"
                ? {
                    startRegisterDate: toUTC(values.startRegisterDate),
                    endRegisterDate: toUTC(values.endRegisterDate),
                }
                : {}),
        };

        dispatch(setLoading(true));
        await dispatch(addCampaignApiThunk(formattedValues)).unwrap().then(() => {
            toast.success("Add Campaign successfully");
            helpers.resetForm();
        }).catch((error) => {
            const errorData = get(error, 'data.message', null);
            helpers.setErrors({ nameCampaign: errorData });
        }).finally(() => {
            helpers.setSubmitting(false);
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000)
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
                                            <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setFieldValue)} className="form-input" />
                                            {errors.images && touched.images && <span className="text-error">{errors.images}</span>}
                                        </div>

                                        {imagePreview.length > 0 && (
                                            <div className="image-preview-container">
                                                {imagePreview.map((img, index) => (
                                                    <img key={index} src={img} alt={`Preview ${index}`} className="image-preview" style={{ width: "100px", height: "100px" }} />
                                                ))}
                                            </div>
                                        )}
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