namespace FDSSYSTEM.DTOs
{
    public class PostDto
    {
        public string? PostText { get; set; }
        public string? PostFile { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public List<string> Images { get; set; }

    }
}
