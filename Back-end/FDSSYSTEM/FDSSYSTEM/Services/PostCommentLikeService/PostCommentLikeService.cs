using FDSSYSTEM.DTOs.CampaignFeedBackLike;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostCommentLikeRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.FeedBackLikeService;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace FDSSYSTEM.Services.PostCommentLikeService
{
    
    public class PostCommentLikeService : IPostCommentLikeService { 
        private readonly IUserContextService _userContextService;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;
        private readonly IPostCommentLikeRepository _postCommentLikeRepository;
        public PostCommentLikeService(IPostCommentLikeRepository postCommentLikeRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            )
        {
            _postCommentLikeRepository = postCommentLikeRepository;
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
        }

        public async Task LikePostComment(PostCommentLikeDto postCommentLikeDto)
        {
            var userId = _userContextService.UserId ?? "";
            var postCommentLike = new PostCommentLike
            {
                PostCommentLikeId = Guid.NewGuid().ToString(),
                ReplyPostCommentId = postCommentLikeDto.ReplyPostCommentId,
                PostCommentId = postCommentLikeDto.PostCommentId,
                AccountId = userId,
                CreatedDate = DateTime.UtcNow
            };

            await _postCommentLikeRepository.AddAsync(postCommentLike);

        }


        public async Task UnlikePostComment(string postCommentId)
        {
            var userId = _userContextService.UserId ?? "";
            var existingLike = await _postCommentLikeRepository.GetByPostCommentLikeIdAndUserIdAsync(postCommentId, userId);
            if (existingLike != null)
            {
                await _postCommentLikeRepository.DeleteAsync(existingLike.Id);
            }
        }

        public async Task<int> GetLikeCount(string postCommentId)
        {
            var filter = Builders<PostCommentLike>.Filter.Eq(p => p.PostCommentId, postCommentId);
            var likes = await _postCommentLikeRepository.GetAllAsync(filter);
            return likes.Count();

        }


    }
}
