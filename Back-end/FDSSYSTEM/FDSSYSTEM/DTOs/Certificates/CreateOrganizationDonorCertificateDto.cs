namespace FDSSYSTEM.DTOs.Certificates
{
    public class CreateOrganizationDonorCertificateDto
    {
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
        public List<string> Images { get; set; }
    }
}
