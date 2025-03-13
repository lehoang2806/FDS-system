using FDSSYSTEM.Enums;

namespace FDSSYSTEM.DTOs.Certificates
{
    public class RejectCertificateDto
    {
        public string CertificateId { get; set; }
        public ApproveCertificateType Type { get; set; }
        public string Comment { get; set; }
    }
}

