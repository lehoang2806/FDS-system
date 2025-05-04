namespace FDSSYSTEM.DTOs.Certificates
{
    public class CreateRecipientCertificateDto
    {
        public string FullName { get; set; }
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
    }
}
