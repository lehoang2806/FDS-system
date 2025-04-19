
using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignDonorSupport;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignDonorSupportRepository;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace FDSSYSTEM.Services.CampaignDonorSupportService
{
    public class CampaignDonorSupportService : ICampaignDonorSupportService
    {
        private readonly IUserContextService _userContextService;
        private readonly IUserRepository _userRepository;
        private readonly ICampaignRepository _campaignRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;
        private readonly ICampaignDonorSupportRepository _campaignDonorSupportRepository;
        private readonly EmailHelper _emailHeper;
        private readonly IWebHostEnvironment _env;

        public CampaignDonorSupportService(
                 IUserContextService userContextService, IUserService userService
                , INotificationService notificationService
                , IHubContext<NotificationHub> hubContext
                , IUserRepository userRepository
                , ICampaignDonorSupportRepository campaignDonorSupportRepository
                , EmailHelper emailHeper
                , IWebHostEnvironment env
                , ICampaignRepository campaignRepository)
        {
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
            _userRepository = userRepository;
            _campaignDonorSupportRepository = campaignDonorSupportRepository;
            _emailHeper = emailHeper;
            _env = env;
            _campaignRepository = campaignRepository;
        }



        public async Task<List<CampaignSupportDetailDto>> GetAllCampaignDonorSupportAsync()
        {
            var campaigns = await _campaignRepository.GetAllAsync();
            var users = await _userRepository.GetAllAsync();

            var donorSupports = await _campaignDonorSupportRepository.GetAllAsync();
            List<CampaignSupportDetailDto> result = donorSupports.Adapt<List<CampaignSupportDetailDto>>();
            foreach (var support in result)
            {
                var campaign = campaigns.FirstOrDefault(x => x.CampaignId == support.CampaignId);
                if (campaign != null)
                {
                    support.CampaignName = campaign.CampaignName;
                }
                var donor = users.FirstOrDefault(x => x.AccountId == support.DonorId);
                if (donor != null)
                {
                    support.DonorFullName = donor.FullName ?? "";
                }
            }
            return result;
        }

        public async Task<List<CampaignSupportDetailDto>> GetAllCampaignDonorSupportByDonorIdAsync(string donorId)
        {
            var allCampaingDonorSupports = await GetAllCampaignDonorSupportAsync();
            return allCampaingDonorSupports.Where(x => x.DonorId == donorId).ToList();
        }

        public async Task AcceptRequestSupport(CampaignDonorSupportAcceptDto acceptDto)
        {
            var donorSupport = await GetCampaignDonorSupportByIdAsync(acceptDto.CampaignDonorSupportId);

            donorSupport.Status = "Accepted";
            donorSupport.GiftQuantity = acceptDto.GiftQuantity;
            donorSupport.DonorComment = acceptDto.Comment;
            donorSupport.UpdatedDate = DateTime.Now;
            await _campaignDonorSupportRepository.UpdateAsync(donorSupport.Id, donorSupport);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();

            foreach (var userid in userReceiveNotifications)
            {
                //Gửi thông báo trong hệ thống
                var notificationDto = new NotificationDto
                {
                    Title = "Campain mới được tạo",
                    Content = "Có chiến dịch mới được tạo ra",
                    NotificationType = "Pending",
                    ObjectType = "Campain",
                    OjectId = donorSupport.CampaignId,
                    AccountId = userid
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }

        public async Task RejectRequestSupport(CampaignDonorSupportRejectDto rejectDto)
        {
            var donorSupport = await GetCampaignDonorSupportByIdAsync(rejectDto.CampaignDonorSupportId);

            donorSupport.Status = "Rejected";
            donorSupport.DonorComment = rejectDto.Comment;
            donorSupport.UpdatedDate = DateTime.Now;
            await _campaignDonorSupportRepository.UpdateAsync(donorSupport.Id, donorSupport);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();

            foreach (var userid in userReceiveNotifications)
            {
                //Gửi thông báo trong hệ thống
                var notificationDto = new NotificationDto
                {
                    Title = "Campain mới được tạo",
                    Content = "Có chiến dịch mới được tạo ra",
                    NotificationType = "Pending",
                    ObjectType = "Campain",
                    OjectId = donorSupport.CampaignId,
                    AccountId = userid
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }

        public async Task<CampaignDonorSupport> GetCampaignDonorSupportByIdAsync(string campaingDonorSupportId)
        {

            var filter = Builders<CampaignDonorSupport>.Filter.Eq(c => c.CampaignDonorSupportId, campaingDonorSupportId);
            var getbyId = await _campaignDonorSupportRepository.GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

        public async Task RequestDonorSupportAsync(string campaignId)
        {
            //lấy những donor đã confirm
            var donors = await _userService.GetAllDonorConfirmed();
            List<string> donorEmails = new List<string>();
            foreach (var donor in donors)
            {
                await _campaignDonorSupportRepository.AddAsync(new CampaignDonorSupport
                {
                    CampaignDonorSupportId = Guid.NewGuid().ToString(),
                    CampaignId = campaignId,
                    DonorId = donor.AccountId,
                    CreatedDate = DateTime.Now,
                    Status = "Pending"
                });
                if (!string.IsNullOrEmpty(donor.Email))
                {
                    donorEmails.Add(donor.Email);
                }
            }

            string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "CampaignRequestSupport.html");
            if (!System.IO.File.Exists(filePath))
            {
                throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
            }
            string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
            string subject = "Lời mời trao gởi yêu thương";
            await _emailHeper.SendEmailAsync(subject, htmlBody, donorEmails, true);
        }
    }
}
