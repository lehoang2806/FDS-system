import { MenuIcon, NotificationIcon } from "@/assets/icons";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import connection, { startConnection } from "@/signalRService";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const StaffHeader: FC = () => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);

    console.log(notifications)

    useEffect(() => {
        startConnection();
    
        connection.on("ReceiveNotification", (notification: any) => {
            const correctedNotification: NotificationDto = {
                ...notification,
                objectId: notification.objectId || notification.ojectId, // Fix lỗi objectId bị sai tên
            };
    
            setNotifications((prev) => [correctedNotification, ...prev]);
            toast.info(`🔔 ${correctedNotification.title}`);
        });
    
        connection.on("LoadOldNotifications", (oldNotifications: any[]) => {
            const correctedNotifications: NotificationDto[] = oldNotifications.map((notif) => ({
                ...notif,
                objectId: notif.objectId || notif.ojectId,
            }));
    
            setNotifications(correctedNotifications);
        });
    
        return () => {
            connection.off("ReceiveNotification");
            connection.off("LoadOldNotifications");
        };
    }, []);
    

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
                                    notifications.map((notif, index) => (
                                        <div key={index} className="notification-item" onClick={() => handleToDetailUserCampaign(notif.objectId)}>
                                            <strong>Có một chiến dịch mới được tạo</strong>
                                            <p>Đi đến chiến dịch</p>
                                            <small>{notif.createdDate}</small>
                                        </div>
                                    ))
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
