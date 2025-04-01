using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.RegisterReceiverRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using Mapster;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.SignalR;

namespace FDSSYSTEM.Services.RegisterReceiverService
{
    public class RegisterReceiverService : IRegisterReceiverService
    {
        private readonly IRegisterReceiverRepository _registerReceiverRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserContextService _userContextService;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;

        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public RegisterReceiverService(IRegisterReceiverRepository registerReceiverRepository,
             IUserRepository userRepository,  IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext)
        {
           _registerReceiverRepository = registerReceiverRepository;
            _userRepository = userRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;
        }

        // Lấy tất cả các RegisterReceiver
        public async Task<List<RegisterReceiverWithRecipientDto>> GetAll()
        {
            var rs = new List<RegisterReceiverWithRecipientDto>();

            var allRegisterReceiver = await _registerReceiverRepository.GetAllAsync();
            var listCreatorId = allRegisterReceiver.Select(c => c.AccountId).Distinct().ToList();

            var creatorFilter = Builders<Account>.Filter.In(c => c.AccountId, listCreatorId);
            var allCreator = await _userRepository .GetAllAsync(creatorFilter);

            foreach (var cp in allRegisterReceiver)
            {
                var rrDto = cp.Adapt<RegisterReceiverWithRecipientDto>();
                var cretor = allCreator.FirstOrDefault(x => x.AccountId == cp.AccountId);
                if (cretor != null)
                {
                    rrDto.FullName = cretor?.FullName;
                    rrDto.Phone = cretor.Phone;
                    rrDto.Email = cretor.Email;
                    rrDto.RoleId = cretor.RoleId;

                }
                rs.Add(rrDto);
            }

            return rs;
        }


        // Lấy một RegisterReceiver theo ID
        public async Task<RegisterReceiver> GetById(string id)
        {
            var filter = Builders<RegisterReceiver>.Filter.Eq(r => r.RegisterReceiverId, id);
            return (await _registerReceiverRepository.GetAllAsync(filter)).FirstOrDefault();
        }

        // Tạo một RegisterReceiver mới
        public async Task Create(RegisterReceiverDto registerReceiver)
        {
            var newRegisterReceiver = new RegisterReceiver
            {
                AccountId = _userContextService.UserId ?? "",
                RegisterReceiverName = registerReceiver.RegisterReceiverName,
                Quantity = registerReceiver.Quantity,
                CreatAt = registerReceiver.CreatAt,
                RegisterReceiverId = Guid.NewGuid().ToString(),
                CampaignId = registerReceiver.CampaignId,
            };
            await _registerReceiverRepository.AddAsync(newRegisterReceiver);

            //Send notifiction all staff and admin
            var userReceiveNotifications = await _userService.GetAllDonorAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Yêu cầu hỗ trợ mới được tạo",
                    Content = "Có người đăng ký chiến dịch",
                    NotificationType = "Pending",
                    ObjectType = "RegisterReceiver",
                    OjectId = newRegisterReceiver.RegisterReceiverId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        // Cập nhật một RegisterReceiver theo ID
        public async Task Update(string id, RegisterReceiverDto registerReceiver)
        {
            var existingRegisterReceiver = await GetById(id);
            if (existingRegisterReceiver != null)
            {
                existingRegisterReceiver.RegisterReceiverName = registerReceiver.RegisterReceiverName;
                existingRegisterReceiver.Quantity = registerReceiver.Quantity;
                existingRegisterReceiver.CreatAt = registerReceiver.CreatAt;
                existingRegisterReceiver.CampaignId = registerReceiver.CampaignId;
                await _registerReceiverRepository.UpdateAsync(existingRegisterReceiver.Id, existingRegisterReceiver);
            }

            var userReceiveNotifications = await _userService.GetAllDonorAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một chiến dịch hỗ trợ mới được cập nhật",
                    Content = "có người đăng ký chiến dịch vừa  cập nhật",
                    NotificationType = "Update",
                    ObjectType = "RegisterReceiver",
                    OjectId = existingRegisterReceiver.RegisterReceiverId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }
    }
}
