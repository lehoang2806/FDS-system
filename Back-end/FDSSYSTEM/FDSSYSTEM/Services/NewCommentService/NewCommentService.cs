using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.NewCommentRepository;
using FDSSYSTEM.Repositories.NewRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.NewCommentService
{
    public class NewCommentService : INewCommentService
    {
        private readonly INewCommentRepository _newCommentRepository;
        private readonly IUserContextService _userContextService;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly INewRepository _newRepository;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public NewCommentService(INewCommentRepository newCommentRepository
             , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            , INewRepository newRepository)
        {
            _newCommentRepository = newCommentRepository;
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
            _newRepository = newRepository;
        }

        // Tạo bình luận mới
        public async Task Create(NewCommentDto comment)
        {
            await _newCommentRepository.AddAsync(new NewComment
            {
                NewCommentId = Guid.NewGuid().ToString(),
                NewId = comment.NewId,
                AccountId = _userContextService.UserId ?? "",
                Content = comment.Content,
                DateCreated = DateTime.Now,
                FileComment = Guid.NewGuid().ToString()
            });

            // Lấy thông tin người tạo bài viết
            var news = await _newRepository.GetByIdAsync(comment.NewId);
            if (news != null)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Bài tin tức của bạn vừa có bình luận mới",
                    Content = "Một người dùng vừa bình luận trên bài tin tức của bạn.",
                    NotificationType = "Comment",
                    ObjectType = "New",
                    OjectId = comment.NewId,
                    AccountId = news.AccountId
                };
                await _notificationService.AddNotificationAsync(notificationDto);
                await _hubNotificationContext.Clients.User(news.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        // Lấy tất cả bình luận theo postId
        public async Task<List<NewComment>> GetByNewId(string newId)
        {
            return (await _newCommentRepository.GetByNewIdAsync(newId)).ToList();
        }

        // Lấy bình luận theo Id
        public async Task<NewComment> GetById(string id)
        {
            var filter = Builders<NewComment>.Filter.Eq(c => c.NewCommentId, id);
            var getbyId = await _newCommentRepository.GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

        // Cập nhật bình luận
        public async Task Update(string id, NewCommentDto comment)
        {
            var existingComment = await GetById(id);
            if (existingComment != null)
            {
                existingComment.Content = comment.Content;
                existingComment.DateUpdated = DateTime.Now;

                await _newCommentRepository.UpdateAsync(id, existingComment);
            }
        }

        // Xóa bình luận
        public async Task Delete(string id)
        {
            await _newCommentRepository.DeleteAsync(id);
        }


    }
}
