import { Link } from "react-router-dom"

const HeaderLanding = () => {
    return (
        <header id="header-landing">
            <div className="hl-container">
                <div className="hlcc1">
                    <h1>Food Distribution System</h1>
                </div>
                <div className="hlcc2">
                    <button>Tạo chiến dịch</button>
                    <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </header>
    )
}

export default HeaderLanding