import { selectIsAuthenticated, selectNotifications } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { CampaignIcon, CertificateIcon, MenuIcon, NotificationIcon } from "@/assets/icons";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { addNotification, setNotifications } from "@/services/notification/notificationSlice";
import { readNotificationApiThunk } from "@/services/notification/notificationThunk";
import connection, { startConnection } from "@/signalRService";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');
dayjs.extend(relativeTime);

const StaffHeader: FC = () => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectNotifications)
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const handleNewNotification = (notification: any) => {
        const correctedNotification: NotificationDto = {
            ...notification,
            notificationId: notification.notificationId || notification.id || notification._id,
            objectId: notification.objectId || notification.ojectId,
        };
    
        dispatch(addNotification(correctedNotification));
    
        // 👉 Lưu nội dung cần hiện toast vào localStorage
        localStorage.setItem("pendingToastMessage", correctedNotification.content);
    
        // 👉 Reload trang
        window.location.reload();
    };

    useEffect(() => {
        const pendingToast = localStorage.getItem("pendingToastMessage");
        if (pendingToast) {
            toast.info(`🔔 ${pendingToast}`);
            localStorage.removeItem("pendingToastMessage"); // Xóa để tránh toast lặp lại
        }
    }, []);   

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
                // Hiển thị thông báo lỗi nếu có
                toast.error(error?.errorMessage || "Có lỗi xảy ra khi đánh dấu thông báo là đã đọc.");
            });
    };

    const unreadCount = notifications.filter((notif) => !notif.isRead).length;

    const unReadCampaignCount = notifications.filter((notif) => notif.objectType === "Campain").length;

    const unReadCertificateCount = notifications.filter((notif) =>
        [
            "Personal Donor Certificate",
            "Organization Donor Certificate",
            "Recipient Certificate"
        ].includes(notif.objectType)
    ).length;

    const toggleSidebar = () => {
        document.getElementById("staff-sidebar")?.classList.toggle("ss-expanded");
        document.getElementById("staff-sidebar")?.classList.toggle("ss-collapsed");
        document.getElementById("staff")?.classList.toggle("staff-expanded");
        document.getElementById("staff")?.classList.toggle("staff-collapsed");
        document.getElementById("staff-header")?.classList.toggle("sh-expanded");
        document.getElementById("staff-header")?.classList.toggle("sh-collapsed");
    };

    const toggleNotifications = () => {
        setIsNotifOpen((prev) => !prev);
    };

    const handleToDetailUserCampaign = (campaignId?: string) => {
        if (!campaignId) {
            return;
        }
        const url = routes.staff.campaign.user.detail.replace(":id", campaignId);
        navigateHook(url);
    };

    const handleToDetailDonorCertificate = (certificateId?: string, type?: string) => {
        if (!certificateId) {
            return;
        }

        if (!type) {
            return;
        }

        const url = routes.staff.certificate.donor.detail.replace(":id", certificateId);
        const fullUrl = `${url}?type=${encodeURIComponent(type)}`;

        navigateHook(fullUrl);
    };

    const handleToDetailRecipientCertificate = (certificateId?: string) => {
        if (!certificateId) {
            return;
        }

        const url = routes.staff.certificate.recipient.detail.replace(":id", certificateId);
        navigateHook(url);
    }

    const [notificationTab, setNotificationTab] = useState("chiendich");

    return (
        <header id="staff-header" className="sh-collapsed">
            <div className="sh-container">
                <div className="shcc1">
                    <MenuIcon className="sh-icon" onClick={toggleSidebar} />
                    <div className="notification-wrapper">
                        <div className="notification-icon-wrapper">
                            <NotificationIcon className="sh-icon" onClick={toggleNotifications} />
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                        </div>
                        {isNotifOpen && (
                            <div className="notification-dropdown">
                                <div className="nd-tabs">
                                    <div
                                        className={`nd-tabs-item ${notificationTab === "chiendich" ? "nd-tabs-item-actived" : ""}`}
                                        onClick={() => setNotificationTab("chiendich")}
                                    >
                                        Chiến dịch
                                        {unReadCampaignCount > 0 && <span className="notification-badge">{unReadCampaignCount > 9 ? "9+" : unReadCampaignCount}</span>}
                                    </div>
                                    <div
                                        className={`nd-tabs-item ${notificationTab === "chungnhan" ? "nd-tabs-item-actived" : ""}`}
                                        onClick={() => setNotificationTab("chungnhan")}
                                    >
                                        Chứng nhận
                                        {unReadCertificateCount > 0 && <span className="notification-badge">{unReadCertificateCount > 9 ? "9+" : unReadCertificateCount}</span>}
                                    </div>
                                </div>

                                {notifications.length > 0 ? (
                                    notifications
                                        .filter((notif) => {
                                            if (notificationTab === "chiendich") {
                                                return notif.objectType === "Campain";
                                            } else {
                                                return [
                                                    "Personal Donor Certificate",
                                                    "Recipient Certificate",
                                                    "Organization Donor Certificate",
                                                ].includes(notif.objectType);
                                            }
                                        })
                                        .map((notif) => {
                                            let actionText = "";

                                            if (notif.objectType === "Campain") {
                                                if (notif.notificationType === "Pending") actionText = "Có chiến dịch được tạo";
                                                if (notif.notificationType === "Update") actionText = "Có chiến dịch được cập nhật";
                                                return (
                                                    <div
                                                        key={notif.notificationId}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => {
                                                            markAsRead(notif.notificationId);
                                                            handleToDetailUserCampaign(notif.ojectId);
                                                        }}
                                                    >
                                                        <CampaignIcon className="notification-icon" />
                                                        <div>
                                                            <strong>{notif.content}</strong>
                                                            <p>{actionText}</p>
                                                            <p>
                                                                {notif?.createdDate
                                                                    ? dayjs.utc(notif.createdDate).tz("Asia/Ho_Chi_Minh").fromNow()
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (notif.objectType === "Personal Donor Certificate") {
                                                if (notif.notificationType === "Pending") actionText = "Có chứng nhận mới được tạo";
                                                if (notif.notificationType === "Update") actionText = "Có chứng nhận mới được cập nhật";
                                                return (
                                                    <div
                                                        key={notif.notificationId}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => {
                                                            markAsRead(notif.notificationId);
                                                            handleToDetailDonorCertificate(notif.ojectId, "Personal");
                                                        }}
                                                    >
                                                        <CertificateIcon className="notification-icon" />
                                                        <div>
                                                            <strong>{notif.content}</strong>
                                                            <p>{actionText}</p>
                                                            <p>
                                                                {notif?.createdDate
                                                                    ? dayjs.utc(notif.createdDate).tz("Asia/Ho_Chi_Minh").fromNow()
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (notif.objectType === "Recipient Certificate") {
                                                if (notif.notificationType === "Pending") actionText = "Có chứng nhận mới được tạo";
                                                if (notif.notificationType === "Update") actionText = "Có chứng nhận mới được cập nhật";
                                                return (
                                                    <div
                                                        key={notif.notificationId}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => {
                                                            markAsRead(notif.notificationId);
                                                            handleToDetailRecipientCertificate(notif.ojectId);
                                                        }}
                                                    >
                                                        <CertificateIcon className="notification-icon" />
                                                        <div>
                                                            <strong>{notif.content}</strong>
                                                            <p>{actionText}</p>
                                                            <p>
                                                                {notif?.createdDate
                                                                    ? dayjs.utc(notif.createdDate).tz("Asia/Ho_Chi_Minh").fromNow()
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (notif.objectType === "Organization Donor Certificate") {
                                                if (notif.notificationType === "Pending") actionText = "Có chứng nhận mới được tạo";
                                                if (notif.notificationType === "Update") actionText = "Có chứng nhận mới được cập nhật";
                                                return (
                                                    <div
                                                        key={notif.notificationId}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => {
                                                            markAsRead(notif.notificationId);
                                                            handleToDetailDonorCertificate(notif.ojectId, "Organization");
                                                        }}
                                                    >
                                                        <CertificateIcon className="notification-icons" />
                                                        <div>
                                                            <strong>{notif.content}</strong>
                                                            <p>{actionText}</p>
                                                            <p>
                                                                {notif?.createdDate
                                                                    ? dayjs.utc(notif.createdDate).tz("Asia/Ho_Chi_Minh").fromNow()
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return null;
                                        })
                                ) : (
                                    <div className="notification-empty">Không có thông báo</div>
                                )}
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StaffHeader;
