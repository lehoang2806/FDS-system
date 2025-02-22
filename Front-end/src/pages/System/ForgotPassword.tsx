import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"

const ForgotPasswordPage = () => {
    return (
        <main id="forgot-pass">
            <section id="fp-section">
                <div className="fps-container">
                    <div className="col-flex fpscc1"></div>
                    <div className="col-flex fpscc2">
                        <div className="fpscc2-main">
                            <h1>Quên mật khẩu</h1>
                            <p>Hãy nhập địa chỉ Email của bạn. Chúng tôi sẽ gữi mã xác thực để truy cập vào tài khoản.</p>
                            <form className="form">
                                <div className="form-field">
                                    <input type="text" className="form-input" placeholder="Nhập địa chỉ email"/>
                                </div>
                                <button className="sc-btn" onClick={() => navigateHook(routes.otp_auth)}>Xác thực</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ForgotPasswordPage