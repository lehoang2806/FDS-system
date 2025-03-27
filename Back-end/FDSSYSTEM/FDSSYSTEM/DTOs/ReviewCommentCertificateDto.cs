using FDSSYSTEM.Enums;

namespace FDSSYSTEM.DTOs
{
    public class ReviewCommentCertificateDto
    {
        public string Content { get; set; }
        public string CertificateId { get; set; }
        public CertificateType Type { get; set; }
    }
}
