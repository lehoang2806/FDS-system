import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"

const UserChangePasswordPage = () => {
  return (
    <main id="user-change-pass">
                <section id="ucp-section">
                    <div className="ucps-container">
                        <div className="col-flex ucpscc1"></div>
                        <div className="col-flex ucpscc2">
                            <div className="ucpscc2-main">
                                <h1>Quên mật khẩu</h1>
                                <p>Hãy nhập mật khẩu hiện tại của bạn. Chúng tôi sẽ gữi mã xác thực để truy cập vào tài khoản.</p>
                                <form className="form">
                                    <div className="form-field">
                                        <input type="text" className="form-input" placeholder="Nhập mật khẩu hiện tại"/>
                                    </div>
                                    <button className="sc-btn" onClick={() => navigateHook(routes.user.new_pass)}>Xác thực</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
  )
}

export default UserChangePasswordPage