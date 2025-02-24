import { MenuIcon, NotificationIcon } from "@/assets/icons"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { FC, useState } from "react"
import { Link } from "react-router-dom"

const HeaderLanding: FC<LandingHeaderProps> = ({ isLogin }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const [isSubMenuProfileOpen, setIsSubMenuProfileOpen] = useState(false);

    const menuItems = [
        {
            name: "Ủng hộ",
            subMenu: [
                {
                    title: "Chiến dịch",
                    to: routes.user.campaign.list
                },
                {
                    title: "Tổ chức, cá nhân hỗ trợ",
                    to: ""
                }
            ]
        },
        { name: "Gây quỹ", subMenu: ["Bắt đầu"] },
        { name: "Khám phá", subMenu: ["Bản tin", "Tin tức"] },
        { name: "Giới thiệu", subMenu: ["Về chúng tôi", "Liên hệ"] }
    ];

    return (
        <header id="header-landing">
            <div className="hl-container">
                <div className="hlcc1">
                    <h1 onClick={() => navigateHook(routes.user.home)}>Food Distribution System</h1>
                </div>
                <div className="hlcc2">
                    <ul className="nav-list">
                        {menuItems.map((item, index) => (
                            <li
                                key={index}
                                className="nav-item"
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <p className="nav-link">{item.name}</p>
                                {hoverIndex === index && item.subMenu.length > 0 && (
                                    <ul className="sub-menu">
                                        {item.subMenu.map((sub, i) => (
                                            <li key={i} className="sub-item">
                                                {typeof sub === "string" ? (
                                                    <span>{sub}</span>
                                                ) : (
                                                    <Link to={sub.to || "#"}>{sub.title}</Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hlcc3">
                    {!isLogin && (
                        <>
                            <Link to={routes.login}>Đăng nhập</Link>
                        </>
                    )}
                    {isLogin && (
                        <>
                            <NotificationIcon width={30} height={30} className="notification-icon" />
                            <figure className="avatar-img"></figure>
                            <MenuIcon width={30} height={30} className="menu-icon" onClick={() => setIsSubMenuProfileOpen(!isSubMenuProfileOpen)} />
                            {isSubMenuProfileOpen && (
                                <div className="sub-menu-profile">
                                    <ul>
                                        <li><Link to={routes.user.profile}>Thông tin cá nhân</Link></li>
                                        <li><Link to={routes.user.change_pass}>Đổi mật khẩu</Link></li>
                                        <li><Link to={""}>Đăng xuất</Link></li>
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default HeaderLanding