namespace FDSSYSTEM.DTOs.Certificates
{
    public class DonorCertificateDto
    {
        public string DonorCertificateId { get; set; }
        public string DonorId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string OrganizationName { get; set; }
        public string TaxIdentificationNumber { get; set; }
        public string CitizenId { get; set; }
        public string Status { get; set; }
        public string RejectComment { get; set; }
        public List<string> Images { get; set; } = new List<string>();
        public string representativeName { get; set; }
        public string representativePhone { get; set; }
        public string representativeCitizenId { get; set; }
        public string representativeEmail { get; set; }
    }
}
