using FDSSYSTEM.Enums;

namespace FDSSYSTEM.DTOs.Certificates
{
    public class ApproveCertificateDto
    {
        public string CertificateId { get; set; }
        public ApproveCertificateType Type { get; set; }
    }
}
