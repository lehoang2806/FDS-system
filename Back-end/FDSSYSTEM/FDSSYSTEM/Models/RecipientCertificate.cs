using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models
{
    public class RecipientCertificate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string RecipientId { get; set; }
        public string RecipientCertificateId { get; set; }
        public string CitizenId { get; set; }
        public string Status { get; set; } = "Pending";
        public string RejectComment { get; set; }
        public string CampaignId { get; set; }
    }
}
