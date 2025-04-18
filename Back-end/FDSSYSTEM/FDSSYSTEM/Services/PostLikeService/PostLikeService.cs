using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostLikeRepository;
using FDSSYSTEM.Repositories.PostRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostLikeService
{
    public class PostLikeService : IPostLikeService
    {
        private readonly IUserContextService _userContextService;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IPostRepository _postRepository;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;
        private readonly IPostLikeRepository _postLikeRepository;
        public PostLikeService(IPostLikeRepository postLikeRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            , IPostRepository postRepository)
        {
            _postLikeRepository = postLikeRepository;
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
            _postRepository = postRepository;
        }

        public async Task LikePost(string postId)
        {
            var userId = _userContextService.UserId ?? "";
            var postLike = new PostLike
            {
                PostLikeId = Guid.NewGuid().ToString(),
                PostId = postId,
                AccountId = userId,
                CreatedDate = DateTime.UtcNow,
                
            };

            await _postLikeRepository.AddAsync(postLike);

            // Lấy thông tin người tạo bài viết
            var post = await _postRepository.GetByPostIdAsync(postId);
            if (post != null)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Bài đăng của bạn vừa được thích",
                    Content = "Một người dùng đã thích bài đăng của bạn.",
                    NotificationType = "Like",
                    ObjectType = "Post",
                    OjectId = postId,
                    AccountId = post.AccountId
                };
                await _notificationService.AddNotificationAsync(notificationDto);
                await _hubNotificationContext.Clients.User(post.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }


        public async Task UnlikePost(string postlikeId)
        {
            var userId = _userContextService.UserId ?? "";
            var existingLike = await _postLikeRepository.GetByPostLikeIdAndUserIdAsync(postlikeId, userId);
            if (existingLike != null)
            {
                await _postLikeRepository.DeleteAsync(existingLike.Id);
            }
        }

        public async Task<int> GetLikeCount(string postId)
        {
            var filter = Builders<PostLike>.Filter.Eq(p => p.PostId, postId);
            var likes = await _postLikeRepository.GetAllAsync(filter);
            return likes.Count();

        }

       
    }
}
