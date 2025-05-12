using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models;

public class OtpCode
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string Email { get; set; }
    public string Code { get; set; }
    public DateTime ExpirationTime { get; set; }
    public bool IsVerified { get; set; }

}
