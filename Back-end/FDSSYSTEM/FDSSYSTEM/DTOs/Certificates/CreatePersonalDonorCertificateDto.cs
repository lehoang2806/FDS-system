namespace FDSSYSTEM.DTOs.Certificates
{
    public class CreatePersonalDonorCertificateDto
    {
        public string CitizenId { get; set; }
        public List<string> Images { get; set; } = new List<string>();
    }
}
