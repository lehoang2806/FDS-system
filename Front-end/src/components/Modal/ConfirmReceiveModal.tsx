import { FC, useEffect } from "react";
import Modal from "./Modal";
import { useAppDispatch } from "@/app/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
    donorUpdateRegisterReceiverApiThunk,
    getAllRegisterReceiversApiThunk,
    updateRegisterReceiverApiThunk,
} from "@/services/registerReceive/registerReceiveThunk";

interface ConfirmReceiveModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedReceiver: any;
}

const ConfirmReceiveModal: FC<ConfirmReceiveModalProps> = ({
    isOpen,
    setIsOpen,
    selectedReceiver,
}) => {
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            quantity: 1,
        },
        validationSchema: Yup.object().shape({
            quantity: Yup.number()
                .required("Vui lòng nhập số lượng")
                .min(1, "Tối thiểu là 1 phần")
                .max(
                    selectedReceiver?.quantity || 10,
                    `Số lượng bạn đăng ký chỉ có ${selectedReceiver?.quantity || 10} phần`
                ),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await Promise.all([
                    dispatch(
                        updateRegisterReceiverApiThunk(
                            selectedReceiver?.registerReceiverId
                        )
                    ).unwrap(),
                    dispatch(
                        donorUpdateRegisterReceiverApiThunk({
                            id: selectedReceiver?.registerReceiverId,
                            params: { quantity: values.quantity },
                        })
                    ).unwrap(),
                ]);
                toast.success("Cập nhật thành công");
                setIsOpen(false);
                dispatch(getAllRegisterReceiversApiThunk());
            } catch (err) {
                toast.error("Cập nhật không thành công");
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (!isOpen) {
            formik.resetForm(); // reset lại giá trị quantity về 1
        }
    }, [isOpen]);    

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="confirm-receive-modal">
                <h2 className="confirm-title">Xác nhận người nhận quà</h2>
                <p className="confirm-receiver">
                    Người nhận:{" "}
                    <strong>{selectedReceiver?.registerReceiverName}</strong>
                </p>
                <p className="confirm-receiver">
                    Số lượng đã đăng ký:{" "}
                    <strong>{selectedReceiver?.quantity} phần</strong>
                </p>

                <form className="form" onSubmit={formik.handleSubmit}>
                    <label className="form-label" htmlFor="quantity">
                        Nhập số lượng thực nhận:
                    </label>
                    <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        className="form-input"
                        style={{ width: "100%", margin: "10px 0" }}
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.quantity && formik.errors.quantity && (
                        <div className="text-error">
                            {formik.errors.quantity}
                        </div>
                    )}

                    <div className="confirm-actions">
                        <button
                            type="button"
                            className="pr-btn cancel"
                            onClick={() => setIsOpen(false)}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="pr-btn"
                            disabled={formik.isSubmitting}
                        >
                            Xác nhận
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ConfirmReceiveModal;
