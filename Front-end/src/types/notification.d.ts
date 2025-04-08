interface NotificationDto {
    notificationId: string;
    title: string;
    content: string;
    notificationType: string;
    objectType: string;
    ojectId: string;
    accountId: string;
    createdDate?: string;
    isRead?: boolean;
}

interface NotificationState {
    notifications: NotificationDto[];
}