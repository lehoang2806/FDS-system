import { MenuIcon, NotificationIcon } from "@/assets/icons"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { FC, useState } from "react"
import { Link } from "react-router-dom"
import { CreateCampaignModal, SubmitCertificateModal } from "../Modal"
import { useAppSelector } from "@/app/store"
import { selectUserLogin } from "@/app/selector"
import { logout } from "@/utils/helper"

const HeaderLanding: FC<LandingHeaderProps> = ({ isLogin }) => {
    const userLogin = useAppSelector(selectUserLogin)

    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const [isSubMenuProfileOpen, setIsSubMenuProfileOpen] = useState(false);

    const [isSubmitCertificateModalOpen, setIsSubmitCertificateModalOpen] = useState(false);

    const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

    const handleCreateCampaign = () => {
        if (userLogin?.isConfirm === false) {
            setIsSubmitCertificateModalOpen(true)
        }
        if (userLogin?.isConfirm === true) {
            setIsCreateCampaignModalOpen(true)
        }
    }

    const menuItems = [
        {
            name: "Chiến dịch",
            subMenu: [
                {
                    title: "Tất cả",
                    to: routes.user.campaign.list
                },
                {
                    title: "Tổ chức",
                    to: routes.user.campaign.list
                },
                {
                    title: "Cá nhân",
                    to: routes.user.campaign.list
                }
            ]
        },
        { name: "Tin tức", subMenu: [{ title: "Tất cả", to: routes.user.news.list }] },
        {
            name: "Khám phá", subMenu: [
                {
                    title: "Tin tức",
                    to: routes.user.news.list
                },
                {
                    title: "Bản tin",
                    to: routes.user.post.forum
                }
            ]
        },
        { name: "Giới thiệu", subMenu: ["Về chúng tôi", "Liên hệ"] }
    ];

    return (
        <header id="header-landing">
            <div className="hl-container">
                <div className="hlcc1">
                    <h1 onClick={() => navigateHook(routes.user.home)}>FDS System</h1>
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
                            <Link to={routes.register}>Đăng Ký</Link>
                        </>
                    )}
                    {isLogin && (
                        <>
                            {userLogin?.roleId === 3 && userLogin?.isConfirm === true ? (
                                <button onClick={handleCreateCampaign} className="sc-btn">Tạo chiến dịch</button>
                            ) : (
                                <p className="note">Tài khoản chưa được xác thực</p>
                            )}
                            <NotificationIcon width={30} height={30} className="notification-icon" />
                            <figure className="avatar-img"></figure>
                            <MenuIcon width={30} height={30} className="menu-icon" onClick={() => setIsSubMenuProfileOpen(!isSubMenuProfileOpen)} />
                            {isSubMenuProfileOpen && (
                                <div className="sub-menu-profile">
                                    <ul>
                                        <li><Link to={routes.user.personal}>Xem trang cá nhân</Link></li>
                                        <li><Link to={routes.user.profile}>Chỉnh sửa thông tin</Link></li>
                                        <li><Link to={routes.user.change_pass}>Đổi mật khẩu</Link></li>
                                        <li><Link to={""} onClick={logout}>Đăng xuất</Link></li>
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <SubmitCertificateModal isOpen={isSubmitCertificateModalOpen} setIsOpen={setIsSubmitCertificateModalOpen} />
            <CreateCampaignModal isOpen={isCreateCampaignModalOpen} setIsOpen={setIsCreateCampaignModalOpen} />
        </header>
    )
}

export default HeaderLanding