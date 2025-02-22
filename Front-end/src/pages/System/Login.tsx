import { Link } from "react-router-dom"
import { navigateHook } from "../../routes/RouteApp"
import { routes } from "@/routes/routeName"

const LoginPage = () => {
    return (
        <main id="login">
            <section id="login-section">
                <div className="ls-container">
                    <div className="col-flex lscc1"></div>
                    <div className="col-flex lscc2">
                        <div className="lscc2-main">
                            <h1>Đăng nhập</h1>
                            <form className="form">
                                <div className="form-field">
                                    <label className="form-label">Email</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Mật Khẩu</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <Link to={routes.forgot_pass}>Quên mật khẩu</Link>
                                <button className="sc-btn">Đăng nhập</button>
                            </form>
                            <p>Bạn chưa có tài khoản? <span onClick={()=>navigateHook(routes.register)}>Đăng ký ngay</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LoginPage