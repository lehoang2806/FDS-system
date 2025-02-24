import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'

const UserNewPasswordPage = () => {
    return (
        <main id="user-new-pass">
            <section id="unp-section">
                <div className="unps-container">
                    <div className="col-flex unpscc1"></div>
                    <div className="col-flex unpscc2">
                        <div className="unpscc2-main">
                            <h1>Quên mật khẩu</h1>
                            <p>Hãy nhập mật khẩu mới bạn muốn. Chúng tôi sẽ cập nhật lại mật khẩu của tài khoản</p>
                            <form className="form">
                                <div className="form-field">
                                    <input type="text" className="form-input" placeholder="Nhập mật khẩu mới" />
                                </div>
                                <div className="form-field">
                                    <input type="text" className="form-input" placeholder="Nhập lại mật khẩu mới" />
                                </div>
                                <button className="sc-btn" onClick={() => navigateHook(routes.user.profile)}>Cập nhật mật khẩu</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default UserNewPasswordPage