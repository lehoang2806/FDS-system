using FDSSYSTEM.DTOs.CampaignFeedBackLike;
using FDSSYSTEM.DTOs.Posts;

namespace FDSSYSTEM.Services.PostCommentLikeService
{
   
    public interface IPostCommentLikeService
    {
        Task LikePostComment(PostCommentLikeDto postCommentLike);
        Task UnlikePostComment(string postCommentId);
        Task<int> GetLikeCount(string postCommentId);
    }
}
