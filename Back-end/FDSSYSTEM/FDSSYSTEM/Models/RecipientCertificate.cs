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
        public string Status { get; set; } = "Pending";
        public string RejectComment { get; set; }
        public string CampaignId { get; set; }
        public string FullName {  get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string BirthDay { get; set; }
        public string Circumstances { get; set; }
        public string RegisterSupportReason { get; set; }
        public string MainSourceIncome { get; set; }
        public string MonthlyIncome { get; set; }
        public List<string> CitizenImages { get; set; }
        public List<string> OtherImages { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public List<RecipientCertificateReViewComment> ReviewComments { get; set; }
    }

    public class RecipientCertificateReViewComment
    {
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
    }
}
