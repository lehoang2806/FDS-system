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
using FDSSYSTEM.Helper;
using FDSSYSTEM.Repositories.OtpRepository;

namespace FDSSYSTEM.Services.RegisterReceiverService
{
    public class RegisterReceiverService : IRegisterReceiverService
    {
        private readonly IRegisterReceiverRepository _registerReceiverRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserContextService _userContextService;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IOtpRepository _otpRepository;
        private readonly EmailHelper _emailHeper;
        private readonly SMSHelper _smsHeper;

        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public RegisterReceiverService(IRegisterReceiverRepository registerReceiverRepository,
             IUserRepository userRepository,  IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            , IOtpRepository otpRepository
            , EmailHelper emailHeper
            , SMSHelper smsHelper)
        {
           _registerReceiverRepository = registerReceiverRepository;
            _userRepository = userRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;
            _otpRepository = otpRepository;
            _emailHeper = emailHeper;
            _smsHeper = smsHelper;
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
            // Lấy thông tin người dùng để lấy Email và PhoneNumber
            var user = await _userService.GetAccountById(_userContextService.UserId);
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Phone))
            {
                throw new Exception("Không thể lấy thông tin Email hoặc PhoneNumber của người dùng.");
            }

            var otp = OTPGenerator.GenerateOTP();
            var newRegisterReceiver = new RegisterReceiver
            {
                AccountId = _userContextService.UserId ?? "",
                RegisterReceiverName = registerReceiver.RegisterReceiverName,
                Quantity = registerReceiver.Quantity,
                CreatAt = registerReceiver.CreatAt,
                RegisterReceiverId = Guid.NewGuid().ToString(),
                CampaignId = registerReceiver.CampaignId,
                CreatedDate = DateTime.Now,
                OTP = otp,
                Code = otp,  // gán Code giống OTP
                Status = "Pending"     // trạng thái mặc định
            };

            await _registerReceiverRepository.AddAsync(newRegisterReceiver);

            
            // Gửi OTP qua Email
            string subject = "Đăng thành công";
            string content = $"Xác nhận đăng ký chiến dịch của bạn: {otp}";
            await _emailHeper.SendEmailAsync(subject, content, new List<string> { user.Email });

            // Gửi OTP qua SMS
            _smsHeper.SendSMS(user.Phone, $"FDSSystem mã xác nhận đăng ký chiến dịch của bạn: {otp}");

            // Gửi thông báo tới staff và admin
            var userReceiveNotifications = await _userService.GetAllDonorAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Yêu cầu hỗ trợ mới được tạo",
                    Content = "Có người đăng ký chiến dịch",
                    NotificationType = "Pending",
                    ObjectType = "RegisterReceiver",
                    OjectId = newRegisterReceiver.CampaignId,
                    AccountId = userId
                };
                // Lưu thông báo vào database
                await _notificationService.AddNotificationAsync(notificationDto);
                // Gửi thông báo qua SignalR
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


        public async Task<int> GetTotalRegisteredQuantityAsync(string campaignId, string accountId)
        {
            var filter = Builders<RegisterReceiver>.Filter.And(
                Builders<RegisterReceiver>.Filter.Eq(r => r.CampaignId, campaignId),
                Builders<RegisterReceiver>.Filter.Eq(r => r.AccountId, accountId)
            );

            var registrations = await _registerReceiverRepository.GetAllAsync(filter);
            int total = registrations.Sum(r => r.Quantity);
            return total;
        }



    }
}
