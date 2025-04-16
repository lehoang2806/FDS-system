namespace FDSSYSTEM.DTOs.Posts
{
    public class PostCommentDto
    {
        public required string PostId { get; set; } // ID của bài viết mà bình luận thuộc về
        public string? PostCommentId { get; set; } // nếu ở đây có giá trị thì đây là trả lời comment
        public string? Content { get; set; } // Nội dung bình luận
    }

    public class UpdatePostCommentDto
    {
        public string? ReplyPostCommentId { get; set; } // nếu ở đây có giá trị thì đây là chỉnh sửa cho trả lời bình luận
        public string? Content { get; set; } // Nội dung bình luận
    }
}
