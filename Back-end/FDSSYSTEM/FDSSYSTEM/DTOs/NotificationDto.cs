namespace FDSSYSTEM.DTOs;

public class NotificationDto
{
    public string NotificationId { get; set; }
    public string AccountId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string ObjectType { get; set; } //Campain/Certificatte/....
    public string OjectId { get; set; } //CampainId, CertificateId, ......
    public string NotificationType { get; set; } //Approve/Reject/.......
    public DateTime CreatedDate { get; set; }
}
