const UserProfilePage = () => {
    return (
        <main id="use-profile">
            <section id="up-section">
                <div className="ups-container">
                    <div className="up-avatar"></div>
                    <p>Thông tin cá nhân</p>
                    <form className="form">
                        <div className="form-field">
                            <label className="form-label">
                                Email
                            </label>
                            <input type="text" className="form-input" />
                        </div>
                        <div className="form-field">
                            <label className="form-label">
                                Tên tài khoản
                            </label>
                            <input type="text" className="form-input" />
                        </div>
                        <div className="form-field">
                            <label className="form-label">
                                Địa chỉ
                            </label>
                            <input type="text" className="form-input" />
                        </div>
                        <div className="form-field">
                            <label className="form-label">
                                Số điện thoại
                            </label>
                            <input type="text" className="form-input" />
                        </div>
                    </form>
                    <button className="sc-btn">Cập nhật</button>
                </div>
            </section>
        </main>
    )
}

export default UserProfilePage