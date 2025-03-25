namespace FDSSYSTEM.DTOs;

public class NotificationDto
{
    public string AccountId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public string ObjectType { get; set; } //Campain/Certificatte/....
    public string OjectId { get; set; } //CampainId, CertificateId, ......
    public string NotificationType { get; set; } //Approve/Reject/.......
}
