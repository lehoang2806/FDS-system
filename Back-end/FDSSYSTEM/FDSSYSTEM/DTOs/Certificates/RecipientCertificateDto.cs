namespace FDSSYSTEM.DTOs.Certificates
{
    public class RecipientCertificateDto
    {
        public string RecipientCertificateId { get; set; }
        public string RecipientId { get; set; }
        public string CitizenId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string BirthDay { get; set; }
        public string Circumstances { get; set; }
        public string RegisterSupportReason { get; set; }
        public string MainSourceIncome { get; set; }
        public string MonthlyIncome { get; set; }
        public List<string> Images { get; set; }
        public string Status { get; set; }
        public string RejectComment { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public List<CertificateRecipientReViewComment> ReviewComments { get; set; }
    }
    public class CertificateRecipientReViewComment
    {
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
    }
}



