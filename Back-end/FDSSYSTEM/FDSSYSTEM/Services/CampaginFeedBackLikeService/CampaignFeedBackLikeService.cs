using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignFeedBackLike;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.FeedBackLikeRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.FeedBackLikeService
{
    public class CampaignFeedBackLikeService : ICampaignFeedBackLikeService
    {
        private readonly IUserContextService _userContextService;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;
        private readonly ICampaignFeedBackLikeRepository _feedBackLikeRepository;
        public CampaignFeedBackLikeService(ICampaignFeedBackLikeRepository feedBackLikeRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            )
        {
            _feedBackLikeRepository = feedBackLikeRepository;
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
        }

        public async Task LikeFeedBack(CampaignFeedBackLikeDto campaignFeedBackLike)
        {
            var userId = _userContextService.UserId ?? "";
            var feedBackLike = new CampaignFeedBackLike
            {
                FeedBackLikeId = Guid.NewGuid().ToString(),
                ReplyFeedBackId = campaignFeedBackLike.ReplyCampaignFeedBackId,
                FeedBackId = campaignFeedBackLike.CampaignFeedBackId,
                AccountId = userId,
                CreatedDate = DateTime.UtcNow
            };

            await _feedBackLikeRepository.AddAsync(feedBackLike);

            // Lấy thông tin người tạo bài viết
            //var feedBack = await _feedBackRepository.GetByFeedBackIdAsync(feedBackId);
            //if (feedBack != null)
            //{
            //    var notificationDto = new NotificationDto
            //    {
            //        Title = "Bài đăng của bạn vừa được thích",
            //        Content = "Một người dùng đã thích bài đăng của bạn.",
            //        NotificationType = "Like",
            //        ObjectType = "FeedBack",
            //        OjectId = feedBackId,
            //        AccountId = feedBack.AccountId
            //    };
            //    await _notificationService.AddNotificationAsync(notificationDto);
            //    await _hubNotificationContext.Clients.User(feedBack.AccountId).SendAsync("ReceiveNotification", notificationDto);
            //}
        }


        public async Task UnlikeFeedBack(string campaignFeedBackLikeId)
        {
            var userId = _userContextService.UserId ?? "";
            var existingLike = await _feedBackLikeRepository.GetByFeedBackIdAndUserIdAsync(campaignFeedBackLikeId, userId);
            if (existingLike != null)
            {
                await _feedBackLikeRepository.DeleteAsync(existingLike.Id);
            }
        }

        public async Task<int> GetLikeCount(string feedBackId)
        {
            var filter = Builders<CampaignFeedBackLike>.Filter.Eq(p => p.FeedBackId, feedBackId);
            var likes = await _feedBackLikeRepository.GetAllAsync(filter);
            return likes.Count();

        }


    }
}
