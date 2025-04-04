namespace FDSSYSTEM.DTOs.Posts;

public class PostDetailDto
{
    public string PostId { get; set; }
    public string Status { get; set; } 
    public DateTime CreatedDate { get; set; }
    public List<string> Images { get; set; }
    public string RejectComment { get; set; }
    public string PosterName { get; set; }
    public string PostContent { get; set; } = null!;
    public string PublicDate { get; set; }
    public string PosterId { get; set; }
    public string PosterRole { get; set; }
    public string PosterApproverId { get; set; }
    public string PosterApproverName { get; set; }

    public IEnumerable<PostLikeDetailDto> Likes { get; set; }
    public IEnumerable<PostCommentDetailDto> Comments { get; set; }
}

public class PostLikeDetailDto
{
    public string FullName {  get; set; }
    public string CreatedDate { get; set; }
}

public  class PostCommentDetailDto
{
    public string FullName { get; set; }
    public string Content { get; set; }
    public string FileComment { get; set; }
    public string CreatedDate { get; set; }
}