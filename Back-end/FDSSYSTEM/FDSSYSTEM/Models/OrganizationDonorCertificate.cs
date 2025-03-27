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
        public string OrganizationAbbreviatedName { get; set; }
        public string OrganizationType { get; set; }
        public string MainBusiness {  get; set; }
        public string OrganizationAddress { get; set; }
        public string ContactPhone { get; set; }
        public string OrganizationEmail { get; set; }
        public string WebsiteLink { get; set; }
        public string RepresentativeName { get; set; }
        public string RepresentativePhone { get; set; }
        public string RepresentativeEmail { get;set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public List<string> Images { get; set; }

        public List<OrganizationDonorCertificateReViewComment> ReviewComments { get; set; }
    }
    public class OrganizationDonorCertificateReViewComment
    {
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
    }
}
