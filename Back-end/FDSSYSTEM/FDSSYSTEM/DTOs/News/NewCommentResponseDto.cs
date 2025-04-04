namespace FDSSYSTEM.DTOs
{
    public class NewCommentResponseDto
    {
        public required string NewId { get; set; } // ID bài viết
        public string? Content { get; set; } // Nội dung bình luận
        public string? FileComment { get; set; } // Tệp đính kèm (nếu có)
        public DateTime? DateCreated { get; set; } // Ngày tạo bình luận
        public string AccountName { get; set; } // Tên người bình luận
        public string AccountId { get; set; }
    }
}
