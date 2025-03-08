namespace FDSSYSTEM.DTOs
{
    public class PostCommentDto
    {
        public required string PostId {get; set;} // ID của bài viết mà bình luận thuộc về
        public int AccountId { get; set; }        // ID của người dùng bình luận
        public string? Content { get; set; } // Nội dung bình luận
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated {get; set;}
        public string? FileComment { get; set; }
    }
}
