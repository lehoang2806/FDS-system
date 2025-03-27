using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.NewRepository;
using FDSSYSTEM.Repositories.PostRepository;
using FDSSYSTEM.Services.PostService;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using FDSSYSTEM.Services.NotificationService;
using Microsoft.AspNetCore.SignalR;
namespace FDSSYSTEM.Services.NewService
{
    public class NewService : INewService
    {
        private readonly INewRepository _newRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;
        private object _newsCollection;

        public NewService(INewRepository newRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            )
        {
            _newRepository = newRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;
        }



        public async Task Create(NewDto newDto)
        {
            var news = new New
            {
                PostText = newDto.PostText,
                CreatedDate = DateTime.Now,
                PostFile = newDto.PostFile,
                Images = newDto.Images,
                NewId = Guid.NewGuid().ToString(),
                Content = newDto.Content,
                Status = "Pending"

            };
            await _newRepository.AddAsync(news);

            //Send notifiction all staff and admin
            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một bài báo mới được tạo",
                    Content = "Có một bài báo mới được tạo ra",
                    NotificationType = "Approve",
                    ObjectType = "New",
                    OjectId = news.NewId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        public async Task Delete(string id)
        {
            var filter = Builders<New>.Filter.Eq(news => news.NewId, id);
            await _newRepository.DeleteAsync(filter);
        }

       

        public async Task<New> GetById(string id)
        {
            return await _newRepository.GetByIdAsync(id);
        }



        // Update an existing news post
        public async Task Update(string id, NewDto newDto)
        {
            var news = await _newRepository.GetByIdAsync(id);
            news.PostFile = newDto.PostFile;
            news.Images = newDto.Images;
            news.Content = newDto.Content;
            news.PostText = newDto.PostText;

            await _newRepository.UpdateAsync(news.Id, news);

            //Send notifiction all staff and admin
            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một bài báo mới được tạo",
                    Content = "Có một bài báo mới được tạo ra",
                    NotificationType = "Approve",
                    ObjectType = "New",
                    OjectId = news.NewId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        public async Task Approve(ApproveNewDto approveNewDto)
        {
            var filter = Builders<New>.Filter.Eq(c => c.NewId, approveNewDto.NewId);
            var news = (await _newRepository.GetAllAsync(filter)).FirstOrDefault();

            news.Status = "Approved";
            await _newRepository.UpdateAsync(news.Id, news);

            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Bài báo đã được phê duyệt",
                Content = "Bài báo đã được phê duyệt",
                NotificationType = "Approve",
                ObjectType = "New",
                OjectId = news.NewId,
                AccountId = news.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        }

        public async Task Reject(RejectNewDto rejectNewDto)
        {
            var filter = Builders<New>.Filter.Eq(c => c.NewId, rejectNewDto.NewId);
            var news = (await _newRepository.GetAllAsync(filter)).FirstOrDefault();

            news.Status = "Rejected";
            news.RejectComment = rejectNewDto.Comment;
            await _newRepository.UpdateAsync(news.Id, news);

            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Bài báo không được phê duyệt",
                Content = "Bài báo không được phê duyệt",
                NotificationType = "Reject",
                ObjectType = "New",
                OjectId = news.NewId,
                AccountId = news.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        }

     
        public async Task<List<New>> GetAllNewsApproved()
        {
            var filter = Builders<New>.Filter.Eq(news => news.Status, "Approved");
            return (await _newRepository.GetAllAsync(filter)).ToList();
        }

        public async Task<List<New>> GetAllNewsPending()
        {
            var filter = Builders<New>.Filter.Eq(news => news.Status, "Pending");
            return (await _newRepository.GetAllAsync(filter)).ToList();
        }

        public async Task<List<New>> GetAllNews()
        {
            return (await _newRepository.GetAllAsync()).ToList();
        }

    }
}

