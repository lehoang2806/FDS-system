namespace FDSSYSTEM.DTOs
{
    public class NewDto
    {
        public string? PostText { get; set; }
        public string? PostFile { get; set; }
        public string? Image { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public List<string> Images { get; set; }
    }
}

