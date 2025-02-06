import { navigateHook } from "../../routes/RouteApp"

const RegisterPage = () => {
    return (
        <main id="register">
            <section id="register-section">
                <div className="rs-container">
                    <div className="col-flex rscc1"></div>
                    <div className="col-flex rscc2">
                        <div className="rscc2-main">
                            <h1>Đăng ký</h1>
                            <form className="form">
                                <div className="form-field">
                                    <label className="form-label">Email</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Họ Và Tên</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Mật Khẩu</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Nhập Lại Mật Khẩu</label>
                                    <input type="text" className="form-input" />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Lựa chọn vai trò</label>
                                    <select className="form-input">
                                        <option value="">Người ủng hộ</option>
                                        <option value="">Người thu nhập thấp</option>
                                    </select>
                                </div>
                                <button className="sc-btn">Tiếp tục</button>
                            </form>
                            <p>Bạn đã có tài khoản? <span onClick={() => navigateHook("/login")}>Đăng nhập</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default RegisterPage