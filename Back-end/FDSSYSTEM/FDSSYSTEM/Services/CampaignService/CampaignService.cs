using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Options;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.CampaignDonorSupportService;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.CampaignService
{
    public class CampaignService : ICampaignService
    {
        private readonly IWebHostEnvironment _env;
        private readonly EmailConfig _emailConfig;
        private readonly ICampaignRepository _campaignRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;
        private readonly INotificationService _notificationService;
        private readonly ICampaignDonorSupportService _campaignDonorSupportService;

        private readonly IHubContext<NotificationHub> _hubNotificationContext;
        private readonly SMSHelper _smsHeper;
        private readonly EmailHelper _emailHeper;

        public CampaignService(ICampaignRepository campaignRepository, IUserRepository userRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            , SMSHelper smsHeper
            , ICampaignDonorSupportService campaignDonorSupportService
            , IWebHostEnvironment env
            , IOptions<EmailConfig> options
            , EmailHelper emailHeper)
        {
            _campaignRepository = campaignRepository;
            _userRepository = userRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;
            _smsHeper = smsHeper;
            _campaignDonorSupportService = campaignDonorSupportService;
            _env = env;
            _emailConfig = options.Value;
            _emailHeper = emailHeper;
        }

        public async Task Create(CampaignDto campaign)
        {
            var donorType = _userContextService.Role ?? "";
            bool isDonorCreate = false;
            if (!string.IsNullOrEmpty(donorType) && donorType.Equals("Donor"))
            {
                var user = await _userService.GetAccountById(_userContextService.UserId ?? "");
                if (user != null)
                {
                    donorType = user.DonorType;
                }
                isDonorCreate = true;
            }

            var newCampain = new Campaign
            {
                CampaignId = Guid.NewGuid().ToString(),
                AccountId = _userContextService.UserId ?? "",
                CampaignName = campaign.CampaignName,
                CampaignDescription = campaign.CampaignDescription,
                Location = campaign.Location,
                ImplementationTime = campaign.ImplementationTime,
                TypeGift = campaign.TypeGift,
                EstimatedBudget = campaign.EstimatedBudget,
                AverageCostPerGift = campaign.AverageCostPerGift,
                Status = "Pending",// Nếu không truyền, mặc định là "Pending",
                TypeAccount = donorType, //staff, personal , organization
                Sponsors = campaign.Sponsors,
                StartRegisterDate = campaign.StartRegisterDate,
                EndRegisterDate = campaign.EndRegisterDate,
                Images = campaign.Images,
                ImplementationMethod = campaign.ImplementationMethod,
                Communication = campaign.Communication,
                LimitedQuantity = campaign.LimitedQuantity,
                CampaignType = campaign.CampaignType,
                District = campaign.District,
                CreatedDate= DateTime.Now,
            };

            await _campaignRepository.AddAsync(newCampain);

            //Send notifiction all staff and admin
            var userReceiveNotifications = isDonorCreate ?
                await _userService.GetAllAdminAndStaffId() //donor tạo gửi cho admin, staff
                : await _userService.GetAllAdminAndDnonorId(); //staff tạo gửi cho admin, và donor

            foreach (var userid in userReceiveNotifications)
            {
                //Gửi thông báo trong hệ thống
                var notificationDto = new NotificationDto
                {
                    Title = "Campain mới được tạo",
                    Content = "Có chiến dịch mới được tạo ra",
                    NotificationType = "Pending",
                    ObjectType = "Campain",
                    OjectId = newCampain.CampaignId,
                    AccountId = userid
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

            }

        }

        //public async Task<List<CampaignDto>> GetAllCampaignAccount()
        //{
        //    var campaigns = await _campaignRepository.GetAllAsync();
        //    var accountId = campaigns.Select(c => c.AccountId).Distinct().ToList();

        //    var users = await _userRepository.GetUsersById(accountId); // Lấy thông tin user
        //    var userDict = users.ToDictionary(u => u.Id, u => u); // Tạo Dictionary để truy vấn nhanh

        //    var result = campaigns.Select(campaign => new CampaignDto
        //    {
        //        AccountId = campaign.AccountId,
        //        NameCampaign = campaign.NameCampaign,
        //        Description = campaign.Description,
        //        GiftType = campaign.GiftType,
        //        GiftQuantity = campaign.GiftQuantity,
        //        Address = campaign.Address,
        //        ReceiveDate = campaign.ReceiveDate,

        //        Email = userDict.ContainsKey(campaign.AccountId) ? userDict[campaign.AccountId].Email : null,
        //        FullName = userDict.ContainsKey(campaign.AccountId) ? userDict[campaign.AccountId].FullName : null,
        //        Phone = userDict.ContainsKey(campaign.AccountId) ? userDict[campaign.AccountId].Phone : null
        //    }).ToList();

        //    return result;
        //}


        public async Task Update(string id, CampaignDto campaign)
        {
            var existingCampaign = await GetCampaignById(id, true); // dùng bản raw Campaign

            if (existingCampaign != null)
            {
                existingCampaign.CampaignName = campaign.CampaignName;
                existingCampaign.CampaignDescription = campaign.CampaignDescription;
                existingCampaign.Location = campaign.Location;
                existingCampaign.ImplementationTime = campaign.ImplementationTime;
                existingCampaign.TypeGift = campaign.TypeGift;
                existingCampaign.EstimatedBudget = campaign.EstimatedBudget;
                existingCampaign.AverageCostPerGift = campaign.AverageCostPerGift;
                existingCampaign.Sponsors = campaign.Sponsors;
                existingCampaign.StartRegisterDate = campaign.StartRegisterDate;
                existingCampaign.EndRegisterDate = campaign.EndRegisterDate;
                existingCampaign.Images = campaign.Images;
                existingCampaign.ImplementationMethod = campaign.ImplementationMethod;
                existingCampaign.Communication = campaign.Communication;
                existingCampaign.LimitedQuantity = campaign.LimitedQuantity;
                existingCampaign.CampaignType = campaign.CampaignType;
                existingCampaign.District = campaign.District;

                await _campaignRepository.UpdateAsync(existingCampaign.Id, existingCampaign);

                var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
                foreach (var userId in userReceiveNotifications)
                {
                    var notificationDto = new NotificationDto
                    {
                        Title = "Chiến dịch mới được cập nhật",
                        Content = "Có chiến dịch mới vừa được cập nhật",
                        NotificationType = "Update",
                        ObjectType = "Campain",
                        OjectId = existingCampaign.CampaignId,
                        AccountId = userId
                    };

                    // Lưu notification vào DB
                    await _notificationService.AddNotificationAsync(notificationDto);

                    // Gửi notification qua SignalR
                    await _hubNotificationContext.Clients.User(notificationDto.AccountId)
                        .SendAsync("ReceiveNotification", notificationDto);
                }
            }
        }



        // Trả về Campaign thuần cho Update
        public async Task<Campaign> GetCampaignById(string id, bool isRaw = true)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, id);
            var getbyId = await _campaignRepository.GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

        // Trả về CampaignWithCreatorDto khi cần hiển thị
        public async Task<CampaignWithCreatorDto> GetCampaignById(string id)
        {
            var campaign = await GetCampaignById(id, true); // dùng hàm raw

            if (campaign == null)
                return null;

            var campaignDto = campaign.Adapt<CampaignWithCreatorDto>();

            var creatorFilter = Builders<Account>.Filter.Eq(a => a.AccountId, campaign.AccountId);
            var creatorList = await _userRepository.GetAllAsync(creatorFilter);
            var creator = creatorList.FirstOrDefault();

            if (creator != null)
            {
                campaignDto.FullName = creator.FullName;
                campaignDto.Email = creator.Email;
                campaignDto.Phone = creator.Phone;
                campaignDto.RoleId = creator.RoleId;
            }

            return campaignDto;
        }





        public async Task<List<CampaignWithCreatorDto>> GetAll()
        {
            var rs = new List<CampaignWithCreatorDto>();

            var allCampaign = await _campaignRepository.GetAllAsync();
            var listCreatorId = allCampaign.Select(c => c.AccountId).Distinct().ToList();

            var creatorFilter = Builders<Account>.Filter.In(c => c.AccountId, listCreatorId);
            var allCreator = await _userRepository.GetAllAsync(creatorFilter);

            foreach (var cp in allCampaign)
            {
                var cpDto = cp.Adapt<CampaignWithCreatorDto>();
                var cretor = allCreator.FirstOrDefault(x => x.AccountId == cp.AccountId);
                if (cretor != null)
                {
                    cpDto.FullName = cretor?.FullName;
                    cpDto.Phone = cretor.Phone;
                    cpDto.Email = cretor.Email;
                    cpDto.RoleId = cretor.RoleId;
                }
                rs.Add(cpDto);
            }

            return rs;
        }


        public async Task Delete(string id)
        {
            await _campaignRepository.DeleteAsync(id);
        }

        public async Task Approve(ApproveCampaignDto approveCampaignDto)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, approveCampaignDto.CampaignId);
            var campain = (await _campaignRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Approved";
            await _campaignRepository.UpdateAsync(campain.Id, campain);

            // Send notification to donor
            var donorNotification = new NotificationDto
            {
                Title = "Phê duyệt chiến dịch thành công",
                Content = "Chiến dịch của bạn đã được phê duyệt thành công",
                NotificationType = "Approve",
                ObjectType = "Campain",
                OjectId = campain.CampaignId,
                AccountId = campain.AccountId
            };
            await _notificationService.AddNotificationAsync(donorNotification);
            await _hubNotificationContext.Clients.User(donorNotification.AccountId).SendAsync("ReceiveNotification", donorNotification);

            // Send email to donor
            var donor = await _userService.GetAccountById(campain.AccountId);
            if (donor != null && !string.IsNullOrEmpty(donor.Email))
            {
                string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "ApproveCampaign.html");
                if (!System.IO.File.Exists(filePath))
                {
                    throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
                }

                string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
                string campaignLink = $"{_emailConfig.HomePage}/campaigns/{campain.CampaignId}";
                string body = htmlBody
                    .Replace("{{UserName}}", donor.FullName)
                    .Replace("{{CampaignName}}", campain.CampaignName)
                    .Replace("{{CampaignLink}}", campaignLink);

                string subject = "Chiến dịch của bạn đã được duyệt - FDS-System";
                await _emailHeper.SendEmailAsync(subject, body, new List<string> { donor.Email }, true);
            }

            // Send SMS and notification to recipients
            var userRecieveSsms = await _userService.GetAllRecipientConfirmed();
            foreach (var rp in userRecieveSsms)
            {
                if (!string.IsNullOrEmpty(rp.Phone))
                {
                    _smsHeper.SendSMS(rp.Phone, "Có chiến dịch vừa được tạo ra trên Website. Bạn có thể vào đăng ký ngay");
                }

                var recipientNotification = new NotificationDto
                {
                    Title = "Có một chiến dịch vừa được tạo",
                    Content = "Bạn có thể tham gia đăng ký tại hệ thống",
                    NotificationType = "Notification",
                    ObjectType = "Campain",
                    OjectId = campain.CampaignId,
                    AccountId = rp.AccountId
                };
                await _notificationService.AddNotificationAsync(recipientNotification);
                await _hubNotificationContext.Clients.User(recipientNotification.AccountId).SendAsync("ReceiveNotification", recipientNotification);
            }
        }


        public async Task Reject(RejectCampaignDto rejectCampaignDto)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, rejectCampaignDto.CampaignId);
            var campain = (await _campaignRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Rejected";
            campain.RejectComment = rejectCampaignDto.Comment;
            await _campaignRepository.UpdateAsync(campain.Id, campain);
            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Phê duyệt chiến dịch thất bại",
                Content = "Rất tiếc chiến dịch của bạn không phù hợp.Bạn có thể xem lý do ",
                NotificationType = "Reject",
                ObjectType = "Campain",
                OjectId = campain.CampaignId,
                AccountId = campain.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

            // Gửi email cho donor khi campaign được approve
            var donor = await _userService.GetAccountById(campain.AccountId);
            if (donor != null && !string.IsNullOrEmpty(donor.Email))
            {
                string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "RejectCampaign.html");
                if (!System.IO.File.Exists(filePath))
                {
                    throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
                }

                string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
                string campaignLink = $"{_emailConfig.HomePage}/campaigns/{campain.CampaignId}";
                string body = htmlBody
                    .Replace("{{UserName}}", donor.FullName)
                    .Replace("{{CampaignName}}", campain.CampaignName)
                    .Replace("{{RejectReason}}", rejectCampaignDto.Comment)
                    .Replace("{{CampaignLink}}", campaignLink);


                string subject = "Chiến dịch của bạn đã không được duyệt - FDS-System";
                await _emailHeper.SendEmailAsync(subject, body, new List<string> { donor.Email }, true);
            }
        }

        public async Task AddReviewComment(ReviewCommentCampaignDto reviewCommentCampaignDto)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, reviewCommentCampaignDto.CampaignId);
            var campain = (await _campaignRepository.GetAllAsync(filter)).FirstOrDefault();

            if (campain != null)
            {
                if (campain.ReviewComments == null)
                {
                    campain.ReviewComments = new List<CampainNotificaiton>();
                }
                campain.ReviewComments.Add(new CampainNotificaiton
                {
                    Content = reviewCommentCampaignDto.Content,
                    CreatedDate = DateTime.Now
                });
            }
            await _campaignRepository.UpdateAsync(campain.Id, campain);
            //TODO: Send Email / SMS

            var notificationDto = new NotificationDto
            {
                Title = "Cần bổ sung chiến dịch",
                Content = "Chiến dịch của bạn cần bổ sung thêm.Bạn có thể xem lý do",
                NotificationType = "Review",
                ObjectType = "Campain",
                OjectId = campain.CampaignId,
                AccountId = campain.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

            // Gửi email cho donor khi campaign được approve
            var donor = await _userService.GetAccountById(campain.AccountId);
            if (donor != null && !string.IsNullOrEmpty(donor.Email))
            {
                string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "ReviewCampaign.html");
                if (!System.IO.File.Exists(filePath))
                {
                    throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
                }

                string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
                string campaignLink = $"{_emailConfig.HomePage}/campaigns/{campain.CampaignId}";
                string body = htmlBody
                    .Replace("{{UserName}}", donor.FullName)
                    .Replace("{{CampaignName}}", campain.CampaignName)
                    .Replace("{{CampaignLink}}", campaignLink);

                string subject = "Chiến dịch của bạn cần được bổ sung thêm - FDS-System";
                await _emailHeper.SendEmailAsync(subject, body, new List<string> { donor.Email }, true);
            }

        }

        public async Task Cancel(CancelCampaignDto cancelCampaignDto)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, cancelCampaignDto.CampaignId);
            var campain = (await _campaignRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Canceled";
            campain.CancelComment = cancelCampaignDto.Comment;
            await _campaignRepository.UpdateAsync(campain.Id, campain);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffAndRecipientId();
            foreach (var user in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Chiến dịch mới được cập nhật",
                    Content = "có chiến dịch mới vừa được cập nhật",
                    NotificationType = "Cancel",
                    ObjectType = "Campain",
                    OjectId = campain.CampaignId,
                    AccountId = user.AccountId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }
    }
}