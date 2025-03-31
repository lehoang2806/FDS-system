import { MenuIcon, NotificationIcon } from "@/assets/icons"
import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CreateCampaignModal, SubmitCertificateModal } from "../Modal"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { selectGetProfileUser, selectIsAuthenticated, selectNotifications, selectUserLogin } from "@/app/selector"
import { logout } from "@/utils/helper"
import connection, { startConnection } from "@/signalRService"
import { toast } from "react-toastify"
import { getProfileApiThunk } from "@/services/user/userThunk"
import { addNotification, markNotificationAsRead, setNotifications } from "@/services/notification/notificationSlice"

interface NotificationDto {
    title: string;
    content: string;
    notificationType: string;
    objectType: string;
    objectId: string;
    accountId: string;
    createdDate?: string;
    isRead?: boolean;
}

const HeaderLanding: FC<LandingHeaderProps> = ({ isLogin }) => {
    const dispatch = useAppDispatch();

    const userLogin = useAppSelector(selectUserLogin)

    const profileUser = useAppSelector(selectGetProfileUser);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const [isSubMenuProfileOpen, setIsSubMenuProfileOpen] = useState(false);

    const [isSubmitCertificateModalOpen, setIsSubmitCertificateModalOpen] = useState(false);

    const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

    const handleCreateCampaign = () => {
        if (profileUser?.isConfirm === false) {
            setIsSubmitCertificateModalOpen(true)
        }
        if (profileUser?.isConfirm === true) {
            setIsCreateCampaignModalOpen(true)
        }
    }

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifications = useAppSelector(selectNotifications)

    const handleNewNotification = (notification: any) => {
        const correctedNotification: NotificationDto = {
            ...notification,
            objectId: notification.objectId || notification.ojectId,
        };

        dispatch(addNotification(correctedNotification)); // Redux lưu trữ
        toast.info(`🔔 ${correctedNotification.content}`);
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        startConnection();

        connection.on("ReceiveNotification", handleNewNotification);
        connection.on("LoadOldNotifications", (oldNotifications: any[]) => {
            dispatch(setNotifications(oldNotifications.map((notif) => ({
                ...notif,
                objectId: notif.objectId || notif.ojectId,
            }))));
        });

        return () => {
            connection.off("ReceiveNotification", handleNewNotification);
            connection.off("LoadOldNotifications");
        };
    }, [isAuthenticated]);


    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProfileApiThunk(String(userLogin?.accountId)))
                .unwrap();
        }
    }, [isAuthenticated]);

    const unreadCount = notifications.filter((notif) => !notif.isRead).length;

    const toggleNotifications = () => {
        setIsNotifOpen((prev) => !prev);
    };

    const markAsRead = (index: number) => {
        dispatch(markNotificationAsRead(index));
    };

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

    const handleToDetailCampaign = (campaignId: string) => {
        const url = routes.user.detail_campaign.replace(":id", campaignId);
        return navigateHook(url)
    }

    const handleToDetailCertificate = (certificateId?: string, type?: string) => {
        if (!certificateId) {
            console.error("❌ Certificate ID is required!");
            return;
        }

        if (!type) {
            console.error("❌ Type is required!");
            return;
        }

        const url = routes.user.detail_certificate.replace(":id", certificateId);
        const fullUrl = `${url}?type=${encodeURIComponent(type)}`;

        navigateHook(fullUrl);
    };

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
                            {userLogin?.roleId === 3 &&
                                (profileUser?.isConfirm === true ? (
                                    <button onClick={handleCreateCampaign} className="sc-btn">Tạo chiến dịch</button>
                                ) : (
                                    <p className="note">Tài khoản chưa được xác thực</p>
                                )
                                )
                            }
                            {userLogin?.roleId === 4 &&
                                (profileUser?.isConfirm === false && <p className="note">Tài khoản chưa được xác thực</p>)
                            }
                            <div className="notification-wrapper">
                                <div className="notification-icon-wrapper">
                                    <NotificationIcon width={30} height={30} className="menu-icon" onClick={toggleNotifications} />
                                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                                </div>
                                {isNotifOpen && (
                                    <div className="notification-dropdown">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => {
                                                if (notif.objectType === "Campain") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "Approve") actionText = "Chiến dịch đã được phê duyệt.";
                                                    if (notif.notificationType === "Reject") actionText = "Chiến dịch đã bị từ chối.";
                                                    if (notif.notificationType === "Review") actionText = "Chiến dịch đang chờ xem xét.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.objectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => { markAsRead(notifications.indexOf(notif)); handleToDetailCampaign(notif.objectId || "") }}
                                                            >
                                                                <strong>{notif.content}</strong>
                                                                <p>{actionText}</p>
                                                            </div>
                                                        );
                                                    }
                                                }
                                                if (notif.objectType === "Personal Donor Certificate") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "Approve") actionText = "Đơn xác minh danh tính đã được phê duyệt.";
                                                    if (notif.notificationType === "Reject") actionText = "Đơn xác minh danh tính đã bị từ chối.";
                                                    if (notif.notificationType === "Review") actionText = "Đơn xác minh danh tính đang chờ xem xét.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.objectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => { markAsRead(notifications.indexOf(notif)), handleToDetailCertificate(notif.objectId, "Personal") }}
                                                            >
                                                                <strong>{notif.content}</strong>
                                                                <p>{actionText}</p>
                                                            </div>
                                                        );
                                                    }
                                                }
                                                if (notif.objectType === "RegisterReceiver") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "Pending") actionText = "Có người đăng ký chiến dịch của bạn.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.objectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => { markAsRead(notifications.indexOf(notif)), handleToDetailCertificate(notif.objectId, "Personal") }}
                                                            >
                                                                <strong>{notif.content}</strong>
                                                                <p>{actionText}</p>
                                                            </div>
                                                        );
                                                    }
                                                }
                                                if (notif.objectType === "Organization Donor Certificate") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "Approve") actionText = "Đơn xác minh danh tính đã được phê duyệt.";
                                                    if (notif.notificationType === "Reject") actionText = "Đơn xác minh danh tính đã bị từ chối.";
                                                    if (notif.notificationType === "Review") actionText = "Đơn xác minh danh tính đang chờ xem xét.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.objectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => { markAsRead(notifications.indexOf(notif)), handleToDetailCertificate(notif.objectId, "Organization") }}
                                                            >
                                                                <strong>{notif.content}</strong>
                                                                <p>{actionText}</p>
                                                            </div>
                                                        );
                                                    }
                                                }
                                                if (notif.objectType === "Recipient Certificate") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "Approve") actionText = "Đơn xác minh danh tính đã được phê duyệt.";
                                                    if (notif.notificationType === "Reject") actionText = "Đơn xác minh danh tính đã bị từ chối.";
                                                    if (notif.notificationType === "Review") actionText = "Đơn xác minh danh tính đang chờ xem xét.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.objectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => { markAsRead(notifications.indexOf(notif)), handleToDetailCertificate(notif.objectId, "Recipient") }}
                                                            >
                                                                <strong>{notif.content}</strong>
                                                                <p>{actionText}</p>
                                                            </div>
                                                        );
                                                    }
                                                }
                                                return null;
                                            })
                                        ) : (
                                            <div className="notification-empty">Không có thông báo</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="name">Hello {userLogin?.fullName}</p>
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