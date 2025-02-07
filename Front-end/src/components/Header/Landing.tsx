import { MenuIcon, NotificationIcon } from "@/assets/icons"
import { FC } from "react"
import { Link } from "react-router-dom"

const HeaderLanding: FC<LandingHeaderProps> = ({isLogin}) => {
    return (
        <header id="header-landing">
            <div className="hl-container">
                <div className="hlcc1">
                    <h1>Food Distribution System</h1>
                </div>
                <div className="hlcc2">
                    {!isLogin && (
                        <>
                            <Link to="/login">Đăng nhập</Link>
                        </>
                    )}
                    {isLogin && (
                        <>
                            <NotificationIcon width={30} height={30} className="notification-icon"/>
                            <figure className="avatar-img"></figure>
                            <MenuIcon width={30} height={30} className="menu-icon"/>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default HeaderLanding