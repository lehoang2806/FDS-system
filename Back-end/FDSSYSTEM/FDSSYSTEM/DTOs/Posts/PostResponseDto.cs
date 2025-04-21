namespace FDSSYSTEM.DTOs
{
    public class PostResponseDto
    {
        public string PostId { get; set; }
        public string PostContent { get; set; }
        public List<string> Images { get; set; }
        public string PosterId { get; set; }
        public string PosterRole { get; set; }
        public string PosterName { get; set; }
        public string Status { get; set; }   // Trạng thái bài viết
        public string RejectComment { get; set; }  // Lý do từ chối (nếu có)
        public string PosterApproverId { get; set; }
        public string PosterApproverName { get; set; }
        public string PublicDate { get; set; }

        public List<PostLikeResponseDto> Likes { get; set; }
        public List<PostCommentResponseDto> Comments { get; set; }
    }

    public class PostLikeResponseDto
    {
        public string PostLikeId { get; set; }
        public string AccountId { get; set; }
        public string FullName { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class PostCommentResponseDto
    {
        public string PostCommentId { get; set; }
        public string FullName { get; set; }
        public string Content { get; set; }

        public List<string>? Images { get; set; }
        public DateTime? CreatedDate { get; set; }

        public List<PostCommentLikeResponseDto> Likes { get; set; }
        public List<ReplyPostCommentResponseDto> Replies { get; set; }
    }

    public class ReplyPostCommentResponseDto
    {
        public string ReplyPostCommentId { get; set; }
        public string FullName { get; set; }
        public string Content { get; set; }
        public List<string>? Images { get; set; }
        public DateTime? CreatedDate { get; set; }
        public List<PostCommentLikeResponseDto> Likes { get; set; }
    }

    public class PostCommentLikeResponseDto
    {
        public string PostCommentLikeId { get; set; }
        public string AccountId { get; set; }
        public string FullName { get; set; }
        public DateTime CreatedDate { get; set; }
    }


}
