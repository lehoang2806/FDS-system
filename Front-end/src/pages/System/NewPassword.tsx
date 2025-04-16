import { useAppDispatch } from '@/app/store';
import { OTPInput } from '@/components/Elements';
import Button from '@/components/Elements/Button';
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { resetPasswordApiThunk } from '@/services/auth/authThunk';
import { IForgetPassword } from '@/types/auth';
import { get } from 'lodash';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const NewPasswordPage = () => {
    const [otp, setOtp] = useState("");
    const disptach = useAppDispatch();
    const location = useLocation();
    const userData = location.state as IForgetPassword;
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyOTP = () => {
        if (otp.length === 6) {
            setIsLoading(true);
            disptach(resetPasswordApiThunk({ email: userData.email, newPassword: userData.newPassword, otp: otp }))
                .unwrap()
                .then(() => {
                    toast.success("Thay đổi mật khẩu thành công");
                    navigateHook(routes.login);
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
        <main id="new-pass">
            <section id="np-section">
                <div className="nps-container">
                    <div className="col-flex npscc1"></div>
                    <div className="col-flex npscc2">
                        <div className="npscc2-main">
                            <form className="form">
                                <h1>Xác thực OTP</h1>
                                <p style={{ textAlign: "start" }}>Vui lòng nhập mã xác thực đã gửi đến: <span>{userData.email}</span></p>
                                <OTPInput onChange={setOtp} />
                                <Button loading={isLoading} onClick={handleVerifyOTP} title="Xác thực" />
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default NewPasswordPage