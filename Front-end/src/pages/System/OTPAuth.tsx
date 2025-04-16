import { useState } from "react";
import { routes } from "@/routes/routeName";
import { OTPInput } from "../../components/Elements";
import { navigateHook } from "../../routes/RouteApp";
import { useAppDispatch } from "@/app/store";
import { registerApiThunk, verifyOTPApiThunk } from "@/services/auth/authThunk";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { get } from "lodash";
import { IRegisterEmail } from "@/types/auth";
import Button from "@/components/Elements/Button";

const OTPAuthPage = () => {
    const [otp, setOtp] = useState("");
    const disptach = useAppDispatch();
    const location = useLocation();
    const userData = location.state as IRegisterEmail;
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyOTP = () => {
        if (otp.length === 6) {
            setIsLoading(true);
            disptach(verifyOTPApiThunk({ email: userData.userEmail, otp: otp }))
                .unwrap()
                .then(() => {
                    disptach(registerApiThunk(userData))
                        .unwrap()
                        .then(() => {
                            toast.success("Đăng ký tài khoản thành công");
                            navigateHook(routes.login);
                        }).catch((error) => {
                            const errorMessage = get(error, 'data', 'An error occurred');
                            toast.error(errorMessage);
                        }).finally(() => {
                            setIsLoading(false);
                        });
                })
                .catch((error) => {
                    const errorMessage = get(error, 'data', 'An error occurred');
                    toast.error(errorMessage);
                })
                .finally(() => {
                });
        } else {
            toast.error("Vui lòng nhập đủ 6 số OTP");
        }
    };

    return (
        <main id="otp-auth">
            <section id="oa-section">
                <div className="oas-container">
                    <div className="col-flex oascc1"></div>
                    <div className="col-flex oascc2">
                        <div className="oascc2-main">
                            <h1>Xác thực OTP</h1>
                            <p style={{ textAlign: "start" }}>Vui lòng nhập mã xác thực đã gửi đến: <span>{userData.userEmail}</span></p>
                            <OTPInput onChange={setOtp} />
                            <Button loading={isLoading} onClick={handleVerifyOTP} title="Xác thực" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default OTPAuthPage;
