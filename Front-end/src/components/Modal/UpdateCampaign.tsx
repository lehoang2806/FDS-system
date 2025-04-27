import { ChangeEvent, FC, useEffect, useState } from 'react'
import Modal from './Modal'
import { UpdateCampaignModalProps } from './type'
import { useAppDispatch } from '@/app/store';
import * as Yup from "yup";
import moment from "moment";
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { getCampaignByIdApiThunk, updateCampaignApiThunk } from '@/services/campaign/campaignThunk';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import Button from '../Elements/Button';
import classNames from "classnames";
import { format } from "date-fns";
import { setLoading } from '@/services/app/appSlice';
import Lightbox from 'react-awesome-lightbox';
import { AddCampaign, UpdateCampaign } from '@/types/campaign';

const UpdateCampaignModal: FC<UpdateCampaignModalProps> = ({ isOpen, setIsOpen, selectedCampaign }) => {
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const initialValues: AddCampaign = {
        campaignName: selectedCampaign?.campaignName || "",
        campaignDescription: selectedCampaign?.campaignDescription || "",
        location: selectedCampaign?.location || "",
        implementationTime: selectedCampaign?.implementationTime || "",
        typeGift: selectedCampaign?.typeGift || "",
        estimatedBudget: selectedCampaign?.estimatedBudget || "",
        averageCostPerGift: selectedCampaign?.averageCostPerGift || "",
        sponsors: selectedCampaign?.sponsors || "",
        implementationMethod: selectedCampaign?.implementationMethod || "",
        communication: selectedCampaign?.communication || "",
        limitedQuantity: selectedCampaign?.limitedQuantity || "",
        campaignType: selectedCampaign?.campaignType || "",
        startRegisterDate: selectedCampaign?.startRegisterDate || "",
        endRegisterDate: selectedCampaign?.endRegisterDate || "",
        district: selectedCampaign?.district || "",
        images: selectedCampaign?.images || [],
    };

    const schema = Yup.object().shape({
        campaignName: Yup.string()
            .required("Tên chiến dịch không được để trống")
            .min(3, "Tên chiến dịch phải có ít nhất 3 ký tự"),

        campaignDescription: Yup.string()
            .required("Mô tả không được để trống"),

        typeGift: Yup.string()
            .required("Loại quà tặng không được để trống"),

        location: Yup.string()
            .required("Địa chỉ không được để trống"),

        implementationTime: Yup.string()
            .required("Ngày nhận không được để trống")
            .test("is-future-date", "Ngày nhận phải sau ít nhất 2 ngày kể từ hôm nay", (value) => {
                if (!value) return false;
                const selectedDate = moment(value);
                const minDate = moment().add(2, "days").startOf("day");
                return selectedDate.isAfter(minDate);
            }),

        implementationMethod: Yup.string()
            .required('Phương thức thực hiện là bắt buộc'),

        campaignType: Yup.string()
            .required("Loại chiến dịch là bắt buộc"),

        limitedQuantity: Yup.string()
            .nullable()
            .when("campaignType", {
                is: "Limited",
                otherwise: (schema) => schema.notRequired().nullable(),
            }),

        startRegisterDate: Yup.date()
            .nullable()
            .when("campaignType", {
                is: "Voluntary",
                otherwise: (schema) => schema.notRequired(),
            }),

        district: Yup.string()
            .required("Quận là bắt buộc"),

        endRegisterDate: Yup.date()
            .nullable()
            .when("campaignType", {
                is: "Voluntary",
                then: (schema) =>
                    schema
                        .test(
                            "is-before-implementationTime",
                            "Ngày kết thúc đăng ký phải trước ngày nhận quà",
                            function (value) {
                                if (!value || !this.parent.receiveDate) return true; // Bỏ qua nếu không có giá trị
                                return new Date(value).getTime() < new Date(this.parent.receiveDate).getTime();
                            }
                        ),
            }),

        images: Yup.array().of(Yup.string().required('Mỗi ảnh phải là một chuỗi hợp lệ')).min(1, 'Cần ít nhất một ảnh').required('Danh sách ảnh là bắt buộc'),

    });

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const base64Promises = files.map(file => convertToBase64(file));

            try {
                const base64Images = await Promise.all(base64Promises);
                setFieldValue("images", base64Images);
                setImagePreview(base64Images);
            } catch (_) {
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

    const onSubmit = async (values: UpdateCampaign, helpers: FormikHelpers<UpdateCampaign>) => {
        try {
            await dispatch(updateCampaignApiThunk({ params: values, campaignId: String(selectedCampaign?.campaignId) })).unwrap();
            toast.success("Cập nhật chiến dịch thành công");
            dispatch(setLoading(true));
            dispatch(getCampaignByIdApiThunk(String(selectedCampaign?.campaignId)));
        } catch (error) {
            const errorData = get(error, "data.message", "An error occurred");
            helpers.setErrors({ campaignName: errorData });
        } finally {
            helpers.setSubmitting(false);
            setIsOpen(false);
            setTimeout(() => {
                dispatch(setLoading(false));
            }, 1000);
        }
    };

    useEffect(() => {
        if (selectedCampaign?.images?.length) {
            setImagePreview(selectedCampaign.images);
        } else {
            setImagePreview([]);
        }
    }, [selectedCampaign]);

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
                            values,
                            setFieldValue,
                        }) => (
                            <Form onSubmit={handleSubmit} className='form'>
                                <h1>Cập nhật chiến dịch</h1>
                                <h3>Thông tin chiến dịch</h3>
                                <div className="ccm-form-r1">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Tên chiến dịch<span>*</span></label>
                                        <Field name="campaignName" type="text" placeholder="Hãy nhập tên chiến dịch" className={classNames("form-input", { "is-error": errors.campaignName && touched.campaignName })} />
                                        {errors.campaignName && touched.campaignName && <span className="text-error">{errors.campaignName}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Loại quà tặng<span>*</span></label>
                                        <Field name="typeGift" type="text" placeholder="Hãy nhập loại quà tặng" className={classNames("form-input", { "is-error": errors.typeGift && touched.typeGift })} />
                                        {errors.typeGift && touched.typeGift && <span className="text-error">{errors.typeGift}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Địa điểm<span>*</span></label>
                                        <Field name="location" type="text" placeholder="Hãy nhập địa điẻm giao quà" className={classNames("form-input", { "is-error": errors.location && touched.location })} />
                                        {errors.location && touched.location && <span className="text-error">{errors.location}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Quận/ Huyện<span>*</span></label>
                                        <Field name="district" type="text" placeholder="Hãy nhập Quận/ Huyện" className={classNames("form-input", { "is-error": errors.district && touched.district })} />
                                        {errors.district && touched.district && <span className="text-error">{errors.district}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Thời gian và ngày nhận quà<span>*</span></label>
                                        <Field
                                            name="imple"
                                            type="datetime-local"
                                            value={values.implementationTime ? format(new Date(values.implementationTime), "yyyy-MM-dd'T'HH:mm") : ""}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFieldValue("implementationTime", e.target.value)}
                                            className={classNames("form-input", { "is-error": errors.implementationTime && touched.implementationTime })}
                                        />
                                        {errors.implementationTime && touched.implementationTime && <span className="text-error">{errors.implementationTime}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Phương thức thực hiện<span>*</span></label>
                                        <Field name="implementationMethod" type="text" placeholder="Hãy nhập phương thức thực hiện" className={classNames("form-input", { "is-error": errors.implementationMethod && touched.implementationMethod })} />
                                        {errors.implementationMethod && touched.implementationMethod && <span className="text-error">{errors.implementationMethod}</span>}
                                    </div>
                                    <div className="form-100 form-field">
                                        <label className="form-label">Mô tả<span>*</span></label>
                                        <Field name="campaignDescription" as="textarea" rows={8} placeholder="Hãy nhập mô tả về chiến dịch" className={classNames("form-input", { "is-error": errors.campaignDescription && touched.campaignDescription })} />
                                        {errors.campaignDescription && touched.campaignDescription && <span className="text-error">{errors.campaignDescription}</span>}
                                    </div>
                                    <div className="form-100 form-field">
                                        <label className="form-label">Loại chiến dịch</label>
                                        <div className="radio-group">
                                            <label>
                                                <Field className="form-radio" type="radio" name="campaignType" value="Limited" />
                                                <span>Số lượng giới hạn</span>
                                            </label>
                                            <label>
                                                <Field className="form-radio" type="radio" name="campaignType" value="Voluntary" />
                                                <span>Đăng ký theo nguyện vọng</span>
                                            </label>
                                        </div>
                                    </div>
                                    {values.campaignType === "Limited" && (
                                        <div className="form-50 form-field">
                                            <label className="form-label">Số lượng giới hạn<span>*</span></label>
                                            <Field name="limitedQuantity" type="text" placeholder="Nhập số lượng" className="form-input" />
                                            {errors.limitedQuantity && touched.limitedQuantity && <span className="text-error">{errors.limitedQuantity}</span>}
                                        </div>
                                    )}
                                    {values.campaignType === "Voluntary" && (
                                        <>
                                            <div className="form-50 form-field">
                                                <label className="form-label">Ngày mở đăng ký<span>*</span></label>
                                                <Field name="startRegisterDate" type="datetime-local" className="form-input" />
                                                {errors.startRegisterDate && touched.startRegisterDate && <span className="text-error">{errors.startRegisterDate}</span>}
                                            </div>

                                            <div className="form-50 form-field">
                                                <label className="form-label">Ngày đóng đăng ký<span>*</span></label>
                                                <Field name="endRegisterDate" type="datetime-local" className="form-input" />
                                                {errors.endRegisterDate && touched.endRegisterDate && <span className="text-error">{errors.endRegisterDate}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <h3>Thông tin tài chính</h3>
                                <div className="ccm-form-r2">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Ngân sách ước tính</label>
                                        <Field name="estimatedBudget" type="text" placeholder="Hãy nhập ngân sách ước tính" className={classNames("form-input", { "is-error": errors.estimatedBudget && touched.estimatedBudget })} />
                                        {errors.estimatedBudget && touched.estimatedBudget && <span className="text-error">{errors.estimatedBudget}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Chi phí trung bình mỗi quà tặng</label>
                                        <Field name="averageCostPerGift" type="text" placeholder="Hãy nhập chi phí trung bình mỗi quà tặng" className={classNames("form-input", { "is-error": errors.averageCostPerGift && touched.averageCostPerGift })} />
                                        {errors.averageCostPerGift && touched.averageCostPerGift && <span className="text-error">{errors.averageCostPerGift}</span>}
                                    </div>
                                </div>
                                <h3>Truyền thông</h3>
                                <div className="ccm-form-r3">
                                    <div className="form-50 form-field">
                                        <label className="form-label">Nhà tài trợ</label>
                                        <Field name="sponsors" type="text" placeholder="Hãy nhập nhà tài trợ" className={classNames("form-input", { "is-error": errors.sponsors && touched.sponsors })} />
                                        {errors.sponsors && touched.sponsors && <span className="text-error">{errors.sponsors}</span>}
                                    </div>
                                    <div className="form-50 form-field">
                                        <label className="form-label">Thông tin truyền thông</label>
                                        <Field name="communication" type="text" placeholder="Hãy nhập Thông tin truyền thông" className={classNames("form-input", { "is-error": errors.communication && touched.communication })} />
                                        {errors.communication && touched.communication && <span className="text-error">{errors.communication}</span>}
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Ảnh<span>*</span></label>
                                    <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange(e, setFieldValue)} className={classNames("form-input", { "is-error": errors.images && touched.images })} />
                                    {errors.images && touched.images && <span className="text-error">{errors.images}</span>}
                                </div>

                                {imagePreview.length > 0 && (
                                    <div className="image-preview-container">
                                        {imagePreview.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Preview ${index}`}
                                                className="image-preview"
                                                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                                                onClick={() => setLightboxIndex(index)} // Thêm dòng này để mở Lightbox
                                            />
                                        ))}
                                    </div>
                                )}

                                {lightboxIndex !== null && (
                                    <Lightbox
                                        images={imagePreview.map((src) => ({ url: src }))}
                                        startIndex={lightboxIndex}
                                        onClose={() => setLightboxIndex(null)}
                                    />
                                )}
                                <Button type="submit" title="Cập nhật chiến dịch" loading={isSubmitting} />
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </Modal>
    )
}

export default UpdateCampaignModal;
