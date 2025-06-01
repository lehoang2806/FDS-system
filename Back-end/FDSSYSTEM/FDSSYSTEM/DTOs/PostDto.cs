using System.Security.Cryptography.X509Certificates;

namespace FDSSYSTEM.DTOs
{
    public class PostDto
    {

        public string PostContent { get; set; }
        public List<string>? Images { get; set; }
        public string PosterName { get; set; }
        public List<string> Hashtags { get; set; } = new List<string>();
        public string? ArticleTitle { get; set; }

    }
}
