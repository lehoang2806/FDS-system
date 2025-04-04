namespace FDSSYSTEM.DTOs
{
    public class NewCommentDto
    {
        public required string NewId { get; set; } // ID của bài viết mà bình luận thuộc về
        public string? Content { get; set; } // Nội dung bình luận
        public string? FileComment { get; set; } // comment  = file
    }
}
