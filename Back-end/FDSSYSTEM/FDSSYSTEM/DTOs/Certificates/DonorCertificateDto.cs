namespace FDSSYSTEM.DTOs.Certificates
{
    public class DonorCertificateDto
    {
        public string DonorCertificateId { get; set; }
        public string DonorId { get; set; }
        public string CitizenId { get; set; }
        public string Status { get; set; } = "Pending";
        public string RejectComment { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string FullName { get; set; }
        public string BirthDay { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string SocialMediaLink { get; set; }
        public string MainSourceIncome { get; set; }
        public string MonthlyIncome { get; set; }
        public List<string> Images { get; set; }
        public string OrganizationName { get; set; }
        public string TaxIdentificationNumber { get; set; }
        public string OrganizationAbbreviatedName { get; set; }
        public string OrganizationType { get; set; }
        public string MainBusiness { get; set; }
        public string OrganizationAddress { get; set; }
        public string ContactPhone { get; set; }
        public string OrganizationEmail { get; set; }
        public string WebsiteLink { get; set; }
        public string RepresentativeName { get; set; }
        public string RepresentativePhone { get; set; }
        public string RepresentativeEmail { get; set; }
        public List<DonorCertificateReViewComment> ReviewComments { get; set; }
    }
    public class DonorCertificateReViewComment
    {
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
    }
}




