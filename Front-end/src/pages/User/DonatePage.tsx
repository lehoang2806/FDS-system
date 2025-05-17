import { Payment } from "@/types/app";
import classNames from "classnames";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const getToken = (): string | null => {
    try {
        const persistData = localStorage.getItem("persist:root");
        return persistData
            ? JSON.parse(JSON.parse(persistData).auth).token
            : null;
    } catch {
        return null;
    }
};

const DonatePage = () => {
    const initialValues: Payment = {
        amount: 0,
        message: "",
    };

    const schema = Yup.object().shape({
        amount: Yup.number()
            .typeError("Số tiền phải là số")
            .required("Vui lòng nhập số tiền")
            .positive("Số tiền phải là số dương")
            .integer("Số tiền phải là số nguyên")
            .min(10000, "Số tiền tối thiểu là 10.000 VNĐ"),
        message: Yup.string()
            .required("Vui lòng nhập lời nhắn")
            .max(255, "Lời nhắn không được vượt quá 255 ký tự"),
    });

    const handleSubmit = async (values: Payment) => {
        const token = getToken();
        if (!token) {
            alert("Bạn chưa đăng nhập hoặc thiếu access token.");
            return;
        }

        const amount = Number(values.amount);

        if (isNaN(amount)) {
            alert("Số tiền không hợp lệ");
            return;
        }

        const payload = {
            ...values,
            amount,
        };

        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/api/donordonate/CreateDonorDonate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            if (res.ok && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert(
                    "Không tạo được thanh toán: " +
                        (data.message || "Lỗi không xác định")
                );
            }
        } catch (err) {
            console.error("Lỗi:", err);
            alert("Đã xảy ra lỗi khi gọi API.");
        }
    };

    return (
        <section id="donate-page">
            <div className="dp-conatiner">
                <h1>Ủng hộ chúng tôi</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="form">
                            <label className="form-label">Số tiền (VNĐ):</label>
                            <Field name="amount">
                                {({ field, form }: any) => {
                                    const rawValue = field.value;
                                    const formatted = new Intl.NumberFormat(
                                        "vi-VN"
                                    ).format(rawValue || 0);

                                    return (
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className={classNames(
                                                "form-input",
                                                {
                                                    "form-input-error":
                                                        errors.amount &&
                                                        touched.amount,
                                                }
                                            )}
                                            value={rawValue ? formatted : ""}
                                            onChange={(e) => {
                                                const cleaned =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    ); // bỏ tất cả ký tự không phải số
                                                form.setFieldValue(
                                                    "amount",
                                                    cleaned
                                                );
                                            }}
                                        />
                                    );
                                }}
                            </Field>
                            {errors.amount && touched.amount && (
                                <span className="text-error">
                                    {errors.amount}
                                </span>
                            )}

                            <label className="form-label">Lời nhắn:</label>
                            <Field
                                name="message"
                                type="text"
                                className={classNames("form-input", {
                                    "form-input-error":
                                        errors.message && touched.message,
                                })}
                            />
                            {errors.message && touched.message && (
                                <span className="text-error">
                                    {errors.message}
                                </span>
                            )}

                            <button className="sc-btn" type="submit">
                                Tạo thanh toán
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
};

export default DonatePage;
