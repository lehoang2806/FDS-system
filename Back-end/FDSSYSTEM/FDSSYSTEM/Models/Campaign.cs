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

        public string CampaignName { get; set; }

        public string CampaignDescription { get; set; }

        public string Location { get; set; }

        public string ImplementationTime { get; set; }

        public string TypeGift { get; set; }
        public string EstimatedBudget {  get; set; }
        public string AverageCostPerGift { get; set; }
        public string Sponsors { get; set; }
        public string ImplementationMethod { get; set; }
        public string Communication {  get; set; }
        public int LimitedQuantity { get; set; }
        public string Status { get; set; } = "Pending";  // Mặc định là chờ duyệt
        public string RejectComment { get; set; }
        public string TypeAccount { get; set; } //staff, personal, organization
        public string CampaignType { get; set; } // giới hạn quà tặng, đăng ký thoải mái
        public List<CampainNotificaiton> ReviewComments { get; set; }
        public string CancelComment { get; set; }
        public string StartRegisterDate { get; set; }
        public string EndRegisterDate { get; set; }
        public List <string> Images {  get; set; }
        public string District { get; set; }
        public  DateTime CreatedDate { get; set; } = DateTime.Now;

    }

    public class CampainNotificaiton
    {
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
    }
}
