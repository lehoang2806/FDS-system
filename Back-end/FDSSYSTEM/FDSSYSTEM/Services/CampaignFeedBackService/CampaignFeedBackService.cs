using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignFeedBack;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.FeedBackCommentRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.FeedBackCommentService
{
    public class FeedBackCommentService : ICampaignFeedBackService
    {
        private readonly ICampaignService _campaignService;
        private readonly ICampaignFeedBackRepository _feedBackRepository;
        private readonly IUserContextService _userContextService;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public FeedBackCommentService(ICampaignFeedBackRepository feedBackRepository
                , IUserContextService userContextService, IUserService userService
                , INotificationService notificationService
                , IHubContext<NotificationHub> hubContext
                , ICampaignService campaignService
                , IUserRepository userRepository)
        {
            _feedBackRepository = feedBackRepository;
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
            _campaignService = campaignService;
            _userRepository = userRepository;
        }

        // Tạo bình luận mới
        public async Task Create(CampaignFeedBackDto feedback)
        {
            if (string.IsNullOrEmpty(feedback.FeedBackId))
            {
                //Đây là trường hợp tạo bình luận
                await _feedBackRepository.AddAsync(new CampaignFeedBack
                {
                    FeedBackId = Guid.NewGuid().ToString(),
                    CampaignId = feedback.CampaignId,
                    AccountId = _userContextService.UserId ?? "",
                    Content = feedback.FeedBackContent,
                    Images = feedback.Images,
                    DateCreated = DateTime.Now,

                });

                // Lấy thông tin người tạo campaign => gửi thông báo tới người tạo chiến dịch
                var campaign = await _campaignService.GetCampaignById(feedback.CampaignId);
                if (campaign != null)
                {
                    var notificationDto = new NotificationDto
                    {
                        Title = "Bài đăng của bạn vừa có bình luận mới",
                        Content = "Một người dùng vừa bình luận trên bài đăng của bạn.",
                        NotificationType = "Comment",
                        ObjectType = "FeedBack",
                        OjectId = campaign.CampaignId,
                        AccountId = campaign.AccountId
                    };
                    await _notificationService.AddNotificationAsync(notificationDto);
                    await _hubNotificationContext.Clients.User(campaign.AccountId).SendAsync("ReceiveNotification", notificationDto);
                }
            }
            else
            {
                //Đây là trả lời bình luận
                var feedBack = await _feedBackRepository.GetByFeedBackByIdAsync(feedback.FeedBackId);
                if (feedBack != null)
                {
                    if (feedBack.Replies == null)
                    {
                        feedBack.Replies = new List<ReplyFeedBackComment>();
                    }
                    feedBack.Replies.Add(new ReplyFeedBackComment
                    {
                        ReplyFeedBackCommentId = Guid.NewGuid().ToString(),
                        AccountId = _userContextService.UserId ?? "",
                        Content = feedback.FeedBackContent,
                        Images = feedback.Images,
                        DateCreated = DateTime.Now,
                    });
                    await _feedBackRepository.UpdateAsync(feedBack.Id, feedBack);

                    //gửi thông báo cho người bình luận
                    var notificationDto = new NotificationDto
                    {
                        Title = "Bài đăng của bạn vừa có bình luận mới",
                        Content = "Một người dùng vừa bình luận trên bài đăng của bạn.",
                        NotificationType = "Comment",
                        ObjectType = "FeedBack",
                        OjectId = feedBack.FeedBackId,
                        AccountId = feedBack.AccountId
                    };
                    await _notificationService.AddNotificationAsync(notificationDto);
                    await _hubNotificationContext.Clients.User(feedBack.AccountId).SendAsync("ReceiveNotification", notificationDto);

                }
            }



        }

        // Lấy tất cả bình luận theo postId
        public async Task<List<CampaignFeedBackDetailDto>> GetByFeedBackByCampaignId(string campaignId)
        {
            var feedbacks = await _feedBackRepository.GetByFeedBackCampaignIdAsync(campaignId);
            var feedbackDetails = feedbacks.Adapt<List<CampaignFeedBackDetailDto>>();
            var users = await _userRepository.GetAllAsync();
            feedbackDetails.ForEach(f =>
            {
                var user = users.FirstOrDefault(x => x.AccountId == f.AccountId);
                if(user!= null)
                {
                    f.FullName = user.FullName??"";
                }
                if (f.Replies != null)
                {
                    foreach (var item in f.Replies)
                    {
                        var ur = users.FirstOrDefault(x => x.AccountId == item.AccountId);
                        if (ur != null)
                        {
                            item.FullName = user.FullName ?? "";
                        }
                    }
                }
            });
            return feedbackDetails;
        }

        // Lấy bình luận theo Id
        public async Task<CampaignFeedBack> GetById(string id)
        {
            return await _feedBackRepository.GetByFeedBackByIdAsync(id);
        }

        // Cập nhật feedback
        public async Task Update(string id, UpdateCampaignFeedBackDto feedback)
        {
            var existingFeedBack = await GetById(id);
            if (existingFeedBack != null)
            {
                if (string.IsNullOrEmpty(feedback.ReplyCampaignFeedbackId))
                {
                    //cập nhật bình luận
                    existingFeedBack.Content = feedback.FeedBackContent;
                    existingFeedBack.DateUpdated = DateTime.Now;
                    existingFeedBack.Images = feedback.Images;

                }
                else
                {
                    //cập nhật trả lời bình luận
                    if (existingFeedBack.Replies != null)
                    {
                        foreach (var rp in existingFeedBack.Replies)
                        {
                            if (rp.ReplyFeedBackCommentId.Equals(feedback.ReplyCampaignFeedbackId, StringComparison.OrdinalIgnoreCase))
                            {
                                rp.Content = feedback.FeedBackContent;
                                rp.DateUpdated = DateTime.Now;
                                rp.Images = feedback.Images;
                                break;
                            }
                        }
                    }
                }
                await _feedBackRepository.UpdateAsync(existingFeedBack.Id, existingFeedBack);
            }
        }

        // Xóa bình luậng
        public async Task Delete(string id)
        {
            await _feedBackRepository.DeleteAsync(id);
        }


    }
}
