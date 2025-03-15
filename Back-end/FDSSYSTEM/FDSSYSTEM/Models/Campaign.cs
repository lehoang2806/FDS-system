using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;

namespace FDSSYSTEM.Models
{
    public class Campaign
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string CampaignId { get; set; }

        public string AccountId { get; set; }

        public string NameCampaign { get; set; }

        public string Description { get; set; }

        public string GiftType { get; set; }

        public int GiftQuantity { get; set; }

        public string Address { get; set; }

        public DateTime ReceiveDate { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime? DateUpdated { get; set; }

        public bool? IsDeleted { get; set; }
        public string Status { get; set; } = "Pending";  // Mặc định là chờ duyệt

        public string RejectComment { get; set; }
        public int LimitedQuantity { get; set; }
        public string Comment  { get; set; }
        public string Type { get; set; }//staff , personal, organization
    }
}
