import { selectNotifications } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { MenuIcon, NotificationIcon } from "@/assets/icons";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { addNotification, markNotificationAsRead, setNotifications } from "@/services/notification/notificationSlice";
import connection, { startConnection } from "@/signalRService";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffHeader: FC = () => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dispatch = useAppDispatch();
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
    }, []);

    const markAsRead = (index: number) => {
        dispatch(markNotificationAsRead(index));
    };

    const unreadCount = notifications.filter((notif) => !notif.isRead).length;

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
            console.error("Campaign ID is undefined!");
            return;
        }
        const url = routes.staff.campaign.user.detail.replace(":id", campaignId);
        console.log("Navigating to:", url);
        navigateHook(url);
    };

    const handleToDetailDonorCertificate = (certificateId?: string, type?: string) => {
        if (!certificateId) {
            console.error("❌ Certificate ID is required!");
            return;
        }

        if (!type) {
            console.error("❌ Type is required!");
            return;
        }

        const url = routes.staff.certificate.donor.detail.replace(":id", certificateId);
        const fullUrl = `${url}?type=${encodeURIComponent(type)}`;

        navigateHook(fullUrl);
    };

    const handleToDetailRecipientCertificate = (certificateId?: string) => {
        if (!certificateId) {
            console.error("❌ Certificate ID is required!");
            return;
        }

        const url = routes.staff.certificate.recipient.detail.replace(":id", certificateId);
        navigateHook(url);
    }

    return (
        <header id="staff-header" className="sh-collapsed">
            <div className="sh-container">
                <div className="shcc1">
                    <MenuIcon className="sh-icon" onClick={toggleSidebar} />
                    <div className="notification-wrapper">
                        <div className="notification-icon-wrapper">
                            <NotificationIcon className="sh-icon" onClick={toggleNotifications} />
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </div>
                        {isNotifOpen && (
                            <div className="notification-dropdown">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => {
                                        if (notif.objectType === "Campain") {
                                            let actionText = "";
                                            if (notif.notificationType === "Pending") actionText = "Có chiến dịch được tạo";
                                            if (notif.notificationType === "Update") actionText = "Có chiến dịch được cập nhật";

                                            if (actionText) {
                                                return (
                                                    <div
                                                        key={notif.objectId || notif.createdDate}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => { markAsRead(notifications.indexOf(notif)); handleToDetailUserCampaign(notif.objectId) }}
                                                    >
                                                        <strong>{notif.content}</strong>
                                                        <p>{actionText}</p>
                                                    </div>
                                                );
                                            }
                                        }
                                        if (notif.objectType === "Personal Donor Certificate") {
                                            let actionText = "";
                                            if (notif.notificationType === "Pending") actionText = "Có chứng nhận mới được tạo";
                                            if (notif.notificationType === "Update") actionText = "Có chứng nhận mới được cập nhật";

                                            if (actionText) {
                                                return (
                                                    <div
                                                        key={notif.objectId || notif.createdDate}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => { markAsRead(notifications.indexOf(notif)); handleToDetailDonorCertificate(notif.objectId, "Personal") }}
                                                    >
                                                        <strong>{notif.content}</strong>
                                                        <p>{actionText}</p>
                                                    </div>
                                                );
                                            }
                                        }
                                        if (notif.objectType === "Recipient Certificate") {
                                            let actionText = "";
                                            if (notif.notificationType === "Pending") actionText = "Có chứng nhận mới được tạo";
                                            if (notif.notificationType === "Update") actionText = "Có chứng nhận mới được cập nhật";

                                            if (actionText) {
                                                return (
                                                    <div
                                                        key={notif.objectId || notif.createdDate}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => { markAsRead(notifications.indexOf(notif)); handleToDetailRecipientCertificate(notif.objectId) }}
                                                    >
                                                        <strong>{notif.content}</strong>
                                                        <p>{actionText}</p>
                                                    </div>
                                                );
                                            }
                                        }
                                        if (notif.objectType === "Organization Donor Certificate") {
                                            let actionText = "";
                                            if (notif.notificationType === "Pending") actionText = "Có chứng nhận mới được tạo";
                                            if (notif.notificationType === "Update") actionText = "Có chứng nhận mới được cập nhật";

                                            if (actionText) {
                                                return (
                                                    <div
                                                        key={notif.objectId || notif.createdDate}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => { markAsRead(notifications.indexOf(notif)); handleToDetailDonorCertificate(notif.objectId, "Organization") }}
                                                    >
                                                        <strong>{notif.content}</strong>
                                                        <p>{actionText}</p>
                                                    </div>
                                                );
                                            }
                                        }
                                        if (notif.objectType === "Post") {
                                            let actionText = "";
                                            if (notif.notificationType === "pending") actionText = "Có một bài đăng mới được tạo";
                                            if (notif.notificationType === "Update") actionText = "Có một bài đăng mới được cập nhật";

                                            if (actionText) {
                                                return (
                                                    <div
                                                        key={notif.objectId || notif.createdDate}
                                                        className={`notification-item ${notif.isRead ? "read" : "unread"}`}
                                                        onClick={() => { markAsRead(notifications.indexOf(notif)); handleToDetailDonorCertificate(notif.objectId, "Personal") }}
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
                </div>
            </div>
        </header>
    );
};

export default StaffHeader;
