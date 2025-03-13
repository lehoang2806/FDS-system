using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models
{
    public class OrganizationDonorCertificate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string DonorId { get; set; }
        public string OrganizationDonorCertificateId {  get; set; }
        public string OrganizationName { get; set; }
        public string TaxIdentificationNumber { get; set; }
        public string Status { get; set; } = "Pending";
        public string RejectComment { get; set; }
    }
}
