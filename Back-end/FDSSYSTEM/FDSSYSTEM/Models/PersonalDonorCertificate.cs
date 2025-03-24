using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models
{
    public class PersonalDonorCertificate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string DonorId { get; set; }
        public string PersonalDonorCertificateId {  get; set; }
        public string CitizenId { get; set; }
        public string Status { get; set; } = "Pending";
        public string RejectComment { get; set; }
        public List<string> Images { get; set; } = new List<string>();
    }
}
