import { CampaignIcon, CertificateIcon, MenuIcon, NewsIcon, NotificationIcon } from "@/assets/icons"
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
import { addNotification, setNotifications } from "@/services/notification/notificationSlice"
import { readNotificationApiThunk } from "@/services/notification/notificationThunk"

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

    console.log(notifications)

    const handleNewNotification = (notification: any) => {
        console.log("Received notification:", notification);

        const correctedNotification: NotificationDto = {
            ...notification,
            notificationId: notification.notificationId || notification.id || notification._id,
            ojectId: notification.ojectId || notification.ojectId,
        };

        if (!correctedNotification.notificationId) {
            console.warn("⚠️ Missing notificationId!", correctedNotification);
        }

        console.log("Corrected notification:", correctedNotification);

        dispatch(addNotification(correctedNotification));

        toast.info(`🔔 ${correctedNotification.content}`);

        // 👉 Reload trang sau khi nhận thông báo (ví dụ sau 1 giây)
        setTimeout(() => {
            window.location.reload();
        }, 1000); // Bạn có thể điều chỉnh thời gian delay
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        // Kiểm tra xem kết nối SignalR có tồn tại không, nếu không, tạo kết nối mới
        if (!connection?.state || connection?.state === "Disconnected") {
            startConnection();  // Tạo kết nối nếu chưa có
        }

        // Đăng ký các sự kiện SignalR
        connection.on("ReceiveNotification", handleNewNotification);
        connection.on("LoadOldNotifications", (oldNotifications: any[]) => {
            dispatch(setNotifications(
                oldNotifications.map((notif) => ({
                    ...notif,
                    notificationId: notif.notificationId || notif.id || notif._id,
                    ojectId: notif.ojectId || notif.ojectId,
                }))
            ));
        });

        return () => {
            // Ngắt kết nối khi component unmount
            connection.off("ReceiveNotification", handleNewNotification);
            connection.off("LoadOldNotifications");
        };
    }, [isAuthenticated, connection]);  // Thêm connection vào dependency array    


    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProfileApiThunk(String(userLogin?.accountId)))
                .unwrap();
        }
    }, [isAuthenticated]);

    const unreadCount = notifications.filter((notif) => !notif.isRead).length;

    const unReadCampaignCount = notifications.filter((notif) => notif.objectType === "Campain").length;

    const unReadCertificateCount = notifications.filter((notif) => notif.objectType === "Certificate").length;

    const unReadNewsCount = notifications.filter((notif) => notif.objectType === "New").length;

    const toggleNotifications = () => {
        setIsNotifOpen((prev) => !prev);
    };

    const markAsRead = (notificationId: string) => {
        // Cập nhật UI ngay lập tức
        dispatch(
            setNotifications(
                notifications.map((notification) =>
                    notification.notificationId === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            )
        );

        // Gọi API và xử lý kết quả
        dispatch(readNotificationApiThunk(notificationId))
            .unwrap() // Lấy kết quả trả về nếu thành công
            .then(() => {
                // Cập nhật lại trong Redux khi API thành công
                dispatch(
                    setNotifications(
                        notifications.map((notification) =>
                            notification.notificationId === notificationId
                                ? { ...notification, isRead: true }
                                : notification
                        )
                    )
                );
            })
            .catch((error) => {
                console.error("Error marking notification as read:", error);
                // Hiển thị thông báo lỗi nếu có
                toast.error(error?.errorMessage || "Có lỗi xảy ra khi đánh dấu thông báo là đã đọc.");
            });
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

    const handleToDetailNews = (NewsId: string) => {
        const url = routes.user.news.detail.replace(":id", NewsId);
        return navigateHook(url)
    }

    const [notificationTab, setNotificationTab] = useState("chiendich");

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
                                    {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                                </div>
                                {isNotifOpen && (
                                    <div className="notification-dropdown">
                                        <div className="nd-tabs">
                                            <div
                                                className={`nd-tabs-item ${notificationTab === "chiendich" ? "nd-tabs-item-actived" : ""}`}
                                                onClick={() => { setNotificationTab("chiendich") }}
                                            >
                                                Chiến dịch
                                                {unReadCampaignCount > 0 && <span className="notification-badge">{unReadCampaignCount > 9 ? "9+" : unReadCampaignCount}</span>}
                                            </div>
                                            <div
                                                className={`nd-tabs-item ${notificationTab === "chungnhan" ? "nd-tabs-item-actived" : ""}`}
                                                onClick={() => { setNotificationTab("chungnhan") }}
                                            >
                                                Chứng nhận
                                                {unReadCertificateCount > 0 && <span className="notification-badge">{unReadCertificateCount > 9 ? "9+" : unReadCertificateCount}</span>}
                                            </div>
                                            <div
                                                className={`nd-tabs-item ${notificationTab === "tintuc" ? "nd-tabs-item-actived" : ""}`}
                                                onClick={() => { setNotificationTab("tintuc") }}
                                            >
                                                Tin tức
                                                {unReadNewsCount > 0 && <span className="notification-badge">{unReadNewsCount > 9 ? "9+" : unReadNewsCount}</span>}
                                            </div>
                                        </div>
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => {
                                                if (notificationTab === "chiendich" && notif.objectType === "Campain") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "Approve") actionText = "Chiến dịch đã được phê duyệt.";
                                                    if (notif.notificationType === "Pending") actionText = "Có chiến dịch mới được tạo ra.";
                                                    if (notif.notificationType === "Reject") actionText = "Chiến dịch đã bị từ chối.";
                                                    if (notif.notificationType === "Review") actionText = "Chiến dịch đang chờ xem xét.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.ojectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => {
                                                                    markAsRead(notif.notificationId);
                                                                    handleToDetailCampaign(notif.ojectId || "");
                                                                }}
                                                            >
                                                                <CampaignIcon className="notification-icon" />
                                                                <div>
                                                                    <strong>{notif.content}</strong>
                                                                    <p>{actionText}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                } else {
                                                    <div className="notification-empty">Không có thông báo</div>
                                                }

                                                if (notificationTab === "chiendich" && notif.objectType === "RegisterReceiver") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "Pending") actionText = "Có người đăng ký chiến dịch của bạn.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.ojectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => {
                                                                    markAsRead(notif.notificationId);
                                                                    handleToDetailCertificate(notif.ojectId, "Personal");
                                                                }}
                                                            >
                                                                <CampaignIcon className="notification-icon" />
                                                                <div>
                                                                    <strong>{notif.content}</strong>
                                                                    <p>{actionText}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                } else {
                                                    <div className="notification-empty">Không có thông báo</div>
                                                }

                                                if (notificationTab === "tintuc" && notif.objectType === "New") {
                                                    let actionText = "";
                                                    if (notif.notificationType === "pending") actionText = "Có một bài báo mới được tạo.";

                                                    if (actionText) {
                                                        return (
                                                            <div
                                                                key={notif.ojectId || notif.createdDate}
                                                                className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                onClick={() => {
                                                                    markAsRead(notif.notificationId);
                                                                    handleToDetailNews(notif.ojectId);
                                                                }}
                                                            >
                                                                <NewsIcon className="notification-icon" />
                                                                <div>
                                                                    <strong>{notif.content}</strong>
                                                                    <p>{actionText}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                } else {
                                                    <div className="notification-empty">Không có thông báo</div>
                                                }

                                                if (notificationTab === "chungnhan") {
                                                    if (notif.objectType === "Personal Donor Certificate") {
                                                        let actionText = "";
                                                        if (notif.notificationType === "Approve") actionText = "Đơn xác minh danh tính đã được phê duyệt.";
                                                        if (notif.notificationType === "Reject") actionText = "Đơn xác minh danh tính đã bị từ chối.";
                                                        if (notif.notificationType === "Review") actionText = "Đơn xác minh danh tính đang chờ xem xét.";

                                                        if (actionText) {
                                                            return (
                                                                <div
                                                                    key={notif.ojectId || notif.createdDate}
                                                                    className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                    onClick={() => {
                                                                        markAsRead(notif.notificationId);
                                                                        handleToDetailCertificate(notif.ojectId, "Personal");
                                                                    }}
                                                                >
                                                                    <CertificateIcon className="notification-icon" />
                                                                    <div>
                                                                        <strong>{notif.content}</strong>
                                                                        <p>{actionText}</p>
                                                                    </div>
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
                                                                    key={notif.ojectId || notif.createdDate}
                                                                    className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                    onClick={() => {
                                                                        markAsRead(notif.notificationId);
                                                                        handleToDetailCertificate(notif.ojectId, "Organization");
                                                                    }}
                                                                >
                                                                    <CertificateIcon className="notification-icon" />
                                                                    <div>
                                                                        <strong>{notif.content}</strong>
                                                                        <p>{actionText}</p>
                                                                    </div>
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
                                                                    key={notif.ojectId || notif.createdDate}
                                                                    className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                                    onClick={() => {
                                                                        markAsRead(notif.notificationId);
                                                                        handleToDetailCertificate(notif.ojectId, "Recipient");
                                                                    }}
                                                                >
                                                                    <CertificateIcon className="notification-icon" />
                                                                    <div>
                                                                        <strong>{notif.content}</strong>
                                                                        <p>{actionText}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                } else {
                                                    <div className="notification-empty">Không có thông báo</div>
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