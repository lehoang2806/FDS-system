using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models
{
    public class CampaignDonorSupport
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string CampaignDonorSupportId { get; set; }
        public string CampaignId { get; set; }
        public string DonorId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; } //Pending, Accepted, Rejected
        public string DonorComment { get; set; } // donor comment khi accept hay reject sẽ comment
        public int GiftQuantity { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
