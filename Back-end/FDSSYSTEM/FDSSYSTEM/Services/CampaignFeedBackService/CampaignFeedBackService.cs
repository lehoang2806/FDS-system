using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignFeedBack;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.FeedBackCommentRepository;
using FDSSYSTEM.Repositories.FeedBackLikeRepository;
using FDSSYSTEM.Repositories.PostLikeRepository;
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
        private readonly ICampaignFeedBackLikeRepository _feedBackLikeRepository;

        public FeedBackCommentService(ICampaignFeedBackRepository feedBackRepository
                , IUserContextService userContextService, IUserService userService
                , INotificationService notificationService
                , IHubContext<NotificationHub> hubContext
                , ICampaignService campaignService
                , IUserRepository userRepository
                , ICampaignFeedBackLikeRepository feedBackLikeRepository)
        {
            _feedBackRepository = feedBackRepository;
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
            _campaignService = campaignService;
            _userRepository = userRepository;
            _feedBackLikeRepository = feedBackLikeRepository;
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
                        feedBack.Replies = new List<ReplyFeedBack>();
                    }
                    feedBack.Replies.Add(new ReplyFeedBack
                    {
                        ReplyFeedBackId = Guid.NewGuid().ToString(),
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
            var feedbackLikes = await _feedBackLikeRepository.GetAllAsync();
            feedbackDetails.ForEach(f =>
            {
                //lấy thông tin user feedback
                var user = users.FirstOrDefault(x => x.AccountId == f.AccountId);
                if (user != null)
                {
                    f.FullName = user.FullName ?? "";
                }
                //lấy thông tin user like feedback
                f.Likes = new List<CampaignFeedBackLikeDetailDto>();
                var fblikes = feedbackLikes.Where(x => x.FeedBackId == f.FeedBackId && string.IsNullOrEmpty(x.ReplyFeedBackId));
                foreach (var item in fblikes)
                {
                    var like = new CampaignFeedBackLikeDetailDto
                    {
                        AccountId = item.AccountId,
                        CreatedDate = item.CreatedDate
                    };
                    var u = users.FirstOrDefault(x => x.AccountId == f.AccountId);
                    if (u != null)
                    {
                        like.FullName = u.FullName ?? "";
                    }
                    f.Likes.Add(like);
                }

                //trả lời feedback
                if (f.Replies != null)
                {
                    foreach (var item in f.Replies)
                    {
                        var ur = users.FirstOrDefault(x => x.AccountId == item.AccountId);
                        if (ur != null)
                        {
                            item.FullName = user.FullName ?? "";
                        }

                        //user like trả lời feedback
                        item.Likes = new List<CampaignFeedBackLikeDetailDto>();
                        var fbReplylikes = feedbackLikes.Where(x => x.FeedBackId == f.FeedBackId && x.ReplyFeedBackId == item.ReplyFeedBackId);
                        foreach (var rfb in fbReplylikes)
                        {
                            var like = new CampaignFeedBackLikeDetailDto
                            {
                                AccountId = rfb.AccountId,
                                CreatedDate = rfb.CreatedDate
                            };
                            var u = users.FirstOrDefault(x => x.AccountId == rfb.AccountId);
                            if (u != null)
                            {
                                like.FullName = u.FullName ?? "";
                            }
                            item.Likes.Add(like);
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
                            if (rp.ReplyFeedBackId.Equals(feedback.ReplyCampaignFeedbackId, StringComparison.OrdinalIgnoreCase))
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

        public async Task<CampaignFeedBackDetailDto> GetCampaignFeedBackDetail(string feedbackId)
        {

            var feedback = await _feedBackRepository.GetByFeedBackByIdAsync(feedbackId);
            var feedbackDetail = feedback.Adapt<CampaignFeedBackDetailDto>();
            var users = await _userRepository.GetAllAsync();
            var feedbackLikes = await _feedBackLikeRepository.GetAllAsync();

            var user = users.FirstOrDefault(x => x.AccountId == feedbackDetail.AccountId);
            if (user != null)
            {
                feedbackDetail.FullName = user.FullName ?? "";
            }
            //lấy thông tin user like feedback
            feedbackDetail.Likes = new List<CampaignFeedBackLikeDetailDto>();
            var fblikes = feedbackLikes.Where(x => x.FeedBackId == feedbackDetail.FeedBackId && string.IsNullOrEmpty(x.ReplyFeedBackId));
            foreach (var item in fblikes)
            {
                var like = new CampaignFeedBackLikeDetailDto
                {
                    AccountId = item.AccountId,
                    CreatedDate = item.CreatedDate
                };
                var u = users.FirstOrDefault(x => x.AccountId == feedbackDetail.AccountId);
                if (u != null)
                {
                    like.FullName = u.FullName ?? "";
                }
                feedbackDetail.Likes.Add(like);
            }

            //trả lời feedback
            if (feedbackDetail.Replies != null)
            {
                foreach (var item in feedbackDetail.Replies)
                {
                    var ur = users.FirstOrDefault(x => x.AccountId == item.AccountId);
                    if (ur != null)
                    {
                        item.FullName = user.FullName ?? "";
                    }

                    //user like trả lời feedback
                    item.Likes = new List<CampaignFeedBackLikeDetailDto>();
                    var fbReplylikes = feedbackLikes.Where(x => x.FeedBackId == feedbackDetail.FeedBackId && x.ReplyFeedBackId == item.ReplyFeedBackId);
                    foreach (var rfb in fbReplylikes)
                    {
                        var like = new CampaignFeedBackLikeDetailDto
                        {
                            AccountId = rfb.AccountId,
                            CreatedDate = rfb.CreatedDate
                        };
                        var u = users.FirstOrDefault(x => x.AccountId == rfb.AccountId);
                        if (u != null)
                        {
                            like.FullName = u.FullName ?? "";
                        }
                        item.Likes.Add(like);
                    }
                }
            }

            return feedbackDetail;
        }
    }
}
