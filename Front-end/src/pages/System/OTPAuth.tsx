import { routes } from "@/routes/routeName"
import { OTPInput } from "../../components/Elements"
import { navigateHook } from "../../routes/RouteApp"

const OTPAuthPage = () => {
    return (
        <main id="otp-auth">
            <section id="oa-section">
                <div className="oas-container">
                    <div className="col-flex oascc1"></div>
                    <div className="col-flex oascc2">
                        <div className="oascc2-main">
                            <h1>Xác thực OTP</h1>
                            <OTPInput/>
                            <button className="sc-btn" onClick={()=> navigateHook(routes.otp_auth)}>Xác thực</button>
                            <p>Bạn đã có tài khoản? <span onClick={() => navigateHook(routes.login)}>Đăng nhập</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default OTPAuthPage