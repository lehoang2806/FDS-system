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

interface NotificationState {
    notifications: NotificationDto[];
}