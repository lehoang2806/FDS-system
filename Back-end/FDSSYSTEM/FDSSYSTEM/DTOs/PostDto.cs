namespace FDSSYSTEM.DTOs
{
    public class PostDto
    {
        public string? PostText { get; set; }
        public string? PostFile { get; set; }
        public string? Image { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

    }
}
