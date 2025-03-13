namespace FDSSYSTEM.DTOs.Certificates
{
    public class RecipientCertificateDto
    {
        public string RecipientCertificateId { get; set; }
        public string RecipientId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string CitizenId { get; set; }
        public string Status { get; set; }
        public string RejectComment { get; set; }
    }
}
