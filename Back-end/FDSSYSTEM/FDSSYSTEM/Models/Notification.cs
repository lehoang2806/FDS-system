using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models;

public class Notification
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string AccountId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public string ObjectType { get; set; } //Campain/Certificatte/....
    public string OjectId { get; set; } //CampainId, CertificateId, ......
    public string NotificationType { get; set; } //Approve/Reject/.......
    public bool IsRead {  get; set; }
}
