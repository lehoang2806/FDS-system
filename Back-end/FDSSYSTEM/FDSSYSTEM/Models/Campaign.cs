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


        public string Address { get; set; }

        public DateTime ReceiveDate { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime? DateUpdated { get; set; }

        public bool? IsDeleted { get; set; }

        public string Status { get; set; } = "Pending";  // Mặc định là chờ duyệt

        public string TypeCampaign { get; set; } // giới hạn quà tặng, đăng ký thoải mái

        public int GiftQuantity { get; set; }

        public string StartRegisterDate { get; set; }

        public string EndRegisterDate { get; set; }

        public string RejectComment { get; set; }

        public string Comment  { get; set; }

        public string TypeAccount { get; set; } //staff, personal, organization

        public List<CampainNotificaiton> ReviewComments { get; set; }

        public string CancelComment { get; set; }

        public List<string> Images { get; set; } = new List<string>();
    }

    public class CampainNotificaiton
    {
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
    }
}
