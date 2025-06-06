﻿using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Options;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.RequestSupportRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.CampaignDonorSupportService;
using FDSSYSTEM.Services.CampaignRequestSupportService;
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
    public class CampaignRequestSupportService : ICampaignRequestSupportService
    {
        private readonly IWebHostEnvironment _env;
        private readonly EmailConfig _emailConfig;
        private readonly ICampaignRequestSupportRepository _campaignRequestSupportRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;
        private readonly INotificationService _notificationService;
        private readonly ICampaignDonorSupportService _campaignDonorSupportService;
        private readonly IRequestSupportRepository _requestSupportRepository;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;
        private readonly SMSHelper _smsHeper;
        private readonly EmailHelper _emailHeper;

        public CampaignRequestSupportService(ICampaignRequestSupportRepository campaignRequestSupportRepository, IUserRepository userRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            , SMSHelper smsHeper
            , ICampaignDonorSupportService campaignDonorSupportService
            , IWebHostEnvironment env
            , IOptions<EmailConfig> options
            , EmailHelper emailHeper
            , IRequestSupportRepository requestSupportRepository)
        {
            _campaignRequestSupportRepository = campaignRequestSupportRepository;
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
            _requestSupportRepository = requestSupportRepository;
        }

        public async Task Create(CampaignRequestSupportDto campaignRequestSupportDto)
        {
            var donorType = _userContextService.Role ?? "";
            if (!string.IsNullOrEmpty(donorType) && donorType.Equals("Donor"))
            {
                var user = await _userService.GetAccountById(_userContextService.UserId ?? "");
                if (user != null)
                {
                    donorType = user.DonorType;
                }
            }

            var newCampaignRequestSupport = new CampaignRequestSupport
            {
                CampaignRequestSupportId = Guid.NewGuid().ToString(),
                AccountId = _userContextService.UserId ?? "",
                CampaignRequestSupportName = campaignRequestSupportDto.CampaignRequestSupportName,
                CampaignRequestSupportDescription = campaignRequestSupportDto.CampaignRequestSupportDescription,
                Location = campaignRequestSupportDto.Location,
                ImplementationTime = campaignRequestSupportDto.ImplementationTime,
                EstimatedBudget = campaignRequestSupportDto.EstimatedBudget,
                AverageCostPerGift = campaignRequestSupportDto.AverageCostPerGift,
                Status = "Pending",
                TypeAccount = donorType,
                Sponsors = campaignRequestSupportDto.Sponsors,
                Images = campaignRequestSupportDto.Images,
                ImplementationMethod = campaignRequestSupportDto.ImplementationMethod,
                Communication = campaignRequestSupportDto.Communication,
                LimitedQuantity = campaignRequestSupportDto.LimitedQuantity,
                CreatedDate = DateTime.Now,
                RequestSupportId = campaignRequestSupportDto.RequestSupportId
            };

            if (!string.IsNullOrEmpty(campaignRequestSupportDto.RequestSupportId))
            {
                var request = await _requestSupportRepository.GetByRequestSupportIdAsync(campaignRequestSupportDto.RequestSupportId);
                if (request == null)
                {
                    throw new Exception("Đơn yêu cầu hỗ trợ không tồn tại.");
                }
            }

            await _campaignRequestSupportRepository.AddAsync(newCampaignRequestSupport);

            // Gửi thông báo
            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();


            foreach (var userId in userReceiveNotifications) // Sửa cú pháp foreach
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Chiến dịch mới được tạo",
                    Content = $"Có chiến dịch mới được tạo ra" +
                              (string.IsNullOrEmpty(newCampaignRequestSupport.RequestSupportId) ? "" : " liên quan đến đơn yêu cầu hỗ trợ"),
                    NotificationType = "Pending",
                    ObjectType = "CampaignRequestSupport",
                    OjectId = newCampaignRequestSupport.CampaignRequestSupportId,
                    AccountId = userId
                };
                await _notificationService.AddNotificationAsync(notificationDto);
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


        public async Task Update(string id, CampaignRequestSupportDto campaignRequestSupportDto)
        {
            var existingCampaignRequestSupport = await GetCampaignRequestSupportById(id, true); // dùng bản raw Campaign

            if (existingCampaignRequestSupport != null)
            {
                existingCampaignRequestSupport.CampaignRequestSupportName = campaignRequestSupportDto.CampaignRequestSupportName;
                existingCampaignRequestSupport.CampaignRequestSupportDescription = campaignRequestSupportDto.CampaignRequestSupportDescription;
                existingCampaignRequestSupport.Location = campaignRequestSupportDto.Location;
                existingCampaignRequestSupport.ImplementationTime = campaignRequestSupportDto.ImplementationTime;
                /*existingCampaign.TypeGift = campaign.TypeGift;*/
                existingCampaignRequestSupport.EstimatedBudget = campaignRequestSupportDto.EstimatedBudget;
                existingCampaignRequestSupport.AverageCostPerGift = campaignRequestSupportDto.AverageCostPerGift;
                existingCampaignRequestSupport.Sponsors = campaignRequestSupportDto.Sponsors;
                /* existingCampaign.StartRegisterDate = campaign.StartRegisterDate;*/
                /* existingCampaign.EndRegisterDate = campaign.EndRegisterDate;*/
                existingCampaignRequestSupport.Images = campaignRequestSupportDto.Images;
                existingCampaignRequestSupport.ImplementationMethod = campaignRequestSupportDto.ImplementationMethod;
                existingCampaignRequestSupport.Communication = campaignRequestSupportDto.Communication;
                existingCampaignRequestSupport.LimitedQuantity = campaignRequestSupportDto.LimitedQuantity;
                /*existingCampaign.CampaignType = campaign.CampaignType;*/
                existingCampaignRequestSupport.RequestSupportId = campaignRequestSupportDto.RequestSupportId;

                await _campaignRequestSupportRepository.UpdateAsync(existingCampaignRequestSupport.Id, existingCampaignRequestSupport);

                var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
                foreach (var userId in userReceiveNotifications)
                {
                    var notificationDto = new NotificationDto
                    {
                        Title = "Chiến dịch mới được cập nhật",
                        Content = "Có chiến dịch mới vừa được cập nhật",
                        NotificationType = "Update",
                        ObjectType = "CampainRequestSupport",
                        OjectId = existingCampaignRequestSupport.CampaignRequestSupportId,
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
        public async Task<CampaignRequestSupport> GetCampaignRequestSupportById(string id, bool isRaw = true)
        {
            var filter = Builders<CampaignRequestSupport>.Filter.Eq(c => c.CampaignRequestSupportId, id);
            var getbyId = await _campaignRequestSupportRepository.GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

        // Trả về CampaignWithCreatorDto khi cần hiển thị
        public async Task<CampaignRequestSupportWithCreatorDto> GetCampaignRequestSupportById(string id)
        {
            var campaign = await GetCampaignRequestSupportById(id, true); // dùng hàm raw

            if (campaign == null)
                return null;

            var campaignDto = campaign.Adapt<CampaignRequestSupportWithCreatorDto>();

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





        public async Task<List<CampaignRequestSupportWithCreatorDto>> GetAll()
        {
            var rs = new List<CampaignRequestSupportWithCreatorDto>();

            var allCampaign = await _campaignRequestSupportRepository.GetAllAsync();
            var listCreatorId = allCampaign.Select(c => c.AccountId).Distinct().ToList();

            var creatorFilter = Builders<Account>.Filter.In(c => c.AccountId, listCreatorId);
            var allCreator = await _userRepository.GetAllAsync(creatorFilter);

            foreach (var cp in allCampaign)
            {
                var cpDto = cp.Adapt<CampaignRequestSupportWithCreatorDto>();
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


        public async Task DeleteByCampaignRequestSupportId(string campaignRequestSupportId)
        {
            // Lấy campaign bằng CampaignId
            var campaignRequestSupport = await GetCampaignRequestSupportById(campaignRequestSupportId, true);
            if (campaignRequestSupport == null)
            {
                throw new Exception("Không tìm thấy chiến dịch để xóa.");
            }

            // Kiểm tra quyền
            var userId = _userContextService.UserId;
            var userRole = _userContextService.Role;
            if (campaignRequestSupport.AccountId != userId && !(userRole == "Admin" || userRole == "Staff" || (userRole == "Donor" && campaignRequestSupport.AccountId == userId)))
            {
                throw new Exception("Bạn không có quyền xóa chiến dịch này.");
            }


            // Xử lý RequestSupport nếu có
            if (!string.IsNullOrEmpty(campaignRequestSupport.RequestSupportId))
            {
                var request = await _requestSupportRepository.GetByRequestSupportIdAsync(campaignRequestSupport.RequestSupportId);
                if (request != null)
                {
                    request.ApprovedQuantity -= campaignRequestSupport.LimitedQuantity;
                    await _requestSupportRepository.UpdateAsync(request.Id, request);
                }
            }

            // Xóa campaign bằng CampaignId
            await _campaignRequestSupportRepository.DeleteByCampaignRequestSupportIdAsync(campaignRequestSupportId);

            /*   // Gửi thông báo
               var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
               foreach (var user in userReceiveNotifications)
               {
                   var notificationDto = new NotificationDto
                   {
                       Title = "Chiến dịch đã bị xóa",
                       Content = $"Chiến dịch {campaign.CampaignName} đã bị xóa.",
                       NotificationType = "Delete",
                       ObjectType = "Campaign",
                       OjectId = campaign.CampaignId,
                       AccountId = user
                   };
                   await _notificationService.AddNotificationAsync(notificationDto);
                   await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
               }

               // Gửi email cho donor
               var donor = await _userService.GetAccountById(campaign.AccountId);
               if (donor != null && !string.IsNullOrEmpty(donor.Email))
               {
                   string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "DeleteCampaign.html");
                   if (!System.IO.File.Exists(filePath))
                   {
                       throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
                   }

                   string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
                   string body = htmlBody
                       .Replace("{{UserName}}", donor.FullName)
                       .Replace("{{CampaignName}}", campaign.CampaignName);

                   string subject = "Chiến dịch của bạn đã bị xóa - FDS-System";
                   await _emailHeper.SendEmailAsync(subject, body, new List<string> { donor.Email }, true);
               }*/
        }

        public async Task Approve(ApproveCampaignRequestSupportDto approveCampaignRequestSupportDto)
        {
            var filter = Builders<CampaignRequestSupport>.Filter.Eq(c => c.CampaignRequestSupportId, approveCampaignRequestSupportDto.CampaignRequestSupportId);
            var campaign = (await _campaignRequestSupportRepository.GetAllAsync(filter)).FirstOrDefault();

            if (campaign == null)
            {
                throw new Exception("Không tìm thấy chiến dịch.");
            }

            campaign.Status = "Approved";
            await _campaignRequestSupportRepository.UpdateAsync(campaign.Id, campaign);

            // Xử lý chiến dịch liên quan đến RequestSupport
            if (!string.IsNullOrEmpty(campaign.RequestSupportId))
            {
                var request = await _requestSupportRepository.GetByRequestSupportIdAsync(campaign.RequestSupportId);
                if (request == null)
                {
                    throw new Exception("Không tìm thấy đơn yêu cầu hỗ trợ.");
                }

                // Kiểm tra số lượng
                if (request.ApprovedQuantity + campaign.LimitedQuantity > request.DesiredQuantity)
                {
                    throw new Exception("Số lượng phê duyệt vượt quá số lượng mong muốn của đơn yêu cầu.");
                }

                // Cập nhật ApprovedQuantity
                request.ApprovedQuantity += campaign.LimitedQuantity;
                await _requestSupportRepository.UpdateAsync(request.Id, request);

                // Cập nhật trạng thái donor trong SupportDonor
                var currentDonor = request.SupportDonor.FirstOrDefault(d => d.DonorId == campaign.AccountId);
                if (currentDonor != null)
                {
                    currentDonor.Status = "Participating";
                    await _requestSupportRepository.UpdateAsync(request.Id, request);
                }

                // Gửi thông báo cho donor
                var donorNotification = new NotificationDto
                {
                    Title = "Phê duyệt chiến dịch thành công",
                    Content = "Chiến dịch của bạn đã được phê duyệt thành công",
                    NotificationType = "Approve",
                    ObjectType = "CampaignRequestSupport",
                    OjectId = campaign.CampaignRequestSupportId,
                    AccountId = campaign.AccountId
                };
                await _notificationService.AddNotificationAsync(donorNotification);
                await _hubNotificationContext.Clients.User(donorNotification.AccountId).SendAsync("ReceiveNotification", donorNotification);

                // Gửi email cho donor
                var donor = await _userService.GetAccountById(campaign.AccountId);
                if (donor != null && !string.IsNullOrEmpty(donor.Email))
                {
                    string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "ApproveCampaign.html");
                    if (!System.IO.File.Exists(filePath))
                    {
                        throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
                    }

                    string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
                    string campaignLink = $"{_emailConfig.HomePage}/campaigns/{campaign.CampaignRequestSupportId}";
                    string body = htmlBody
                        .Replace("{{UserName}}", donor.FullName)
                        .Replace("{{CampaignName}}", campaign.CampaignRequestSupportName)
                        .Replace("{{CampaignLink}}", campaignLink);

                    string subject = "Chiến dịch của bạn đã được duyệt - FDS-System";
                    await _emailHeper.SendEmailAsync(subject, body, new List<string> { donor.Email }, true);
                }

                // Gửi SMS và thông báo cho recipient
                var recipient = await _userService.GetAccountById(request.AccountId);

                if (!string.IsNullOrEmpty(recipient.Phone))
                {
                    _smsHeper.SendSMS(recipient.Phone, "Có chiến dịch vừa được tạo ra trên Website. Bạn có thể vào đăng ký ngay");
                }

                var recipientNotification = new NotificationDto
                {
                    Title = "Có một chiến dịch vừa được tạo",
                    Content = "Bạn có thể tham gia đăng ký tại hệ thống",
                    NotificationType = "Notification",
                    ObjectType = "CampaignRequestSupport",
                    OjectId = campaign.CampaignRequestSupportId,
                    AccountId = recipient.AccountId
                };
                await _notificationService.AddNotificationAsync(recipientNotification);
                await _hubNotificationContext.Clients.User(recipientNotification.AccountId).SendAsync("ReceiveNotification", recipientNotification);
            }
        }

        public async Task Reject(RejectCampaignRequestSupportDto rejectCampaignRequestSupportDto)
        {
            var filter = Builders<CampaignRequestSupport>.Filter.Eq(c => c.CampaignRequestSupportId, rejectCampaignRequestSupportDto.CampaignRequestSupportId);
            var campain = (await _campaignRequestSupportRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Rejected";
            campain.RejectComment = rejectCampaignRequestSupportDto.Comment;
            await _campaignRequestSupportRepository.UpdateAsync(campain.Id, campain);
            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Phê duyệt chiến dịch thất bại",
                Content = "Rất tiếc chiến dịch của bạn không phù hợp.Bạn có thể xem lý do ",
                NotificationType = "Reject",
                ObjectType = "CampainRequestSupport",
                OjectId = campain.CampaignRequestSupportId,
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
                string campaignLink = $"{_emailConfig.HomePage}/campaigns/{campain.CampaignRequestSupportId}";
                string body = htmlBody
                    .Replace("{{UserName}}", donor.FullName)
                    .Replace("{{CampaignName}}", campain.CampaignRequestSupportName)
                    .Replace("{{RejectReason}}", rejectCampaignRequestSupportDto.Comment)
                    .Replace("{{CampaignLink}}", campaignLink);


                string subject = "Chiến dịch của bạn đã không được duyệt - FDS-System";
                await _emailHeper.SendEmailAsync(subject, body, new List<string> { donor.Email }, true);
            }
        }

        public async Task AddReviewComment(ReviewCommentCampaignRequestSupportDto reviewCommentCampaignRequestSupportDto)
        {
            var filter = Builders<CampaignRequestSupport>.Filter.Eq(c => c.CampaignRequestSupportId, reviewCommentCampaignRequestSupportDto.CampaignRequestSupportId);
            var campain = (await _campaignRequestSupportRepository.GetAllAsync(filter)).FirstOrDefault();

            if (campain != null)
            {
                if (campain.ReviewComments == null)
                {
                    campain.ReviewComments = new List<CampainNotificaiton>();
                }
                campain.ReviewComments.Add(new CampainNotificaiton
                {
                    Content = reviewCommentCampaignRequestSupportDto.Content,
                    CreatedDate = DateTime.Now
                });
            }
            await _campaignRequestSupportRepository.UpdateAsync(campain.Id, campain);
            //TODO: Send Email / SMS

            var notificationDto = new NotificationDto
            {
                Title = "Cần bổ sung chiến dịch",
                Content = "Chiến dịch của bạn cần bổ sung thêm.Bạn có thể xem lý do",
                NotificationType = "Review",
                ObjectType = "Campain",
                OjectId = campain.CampaignRequestSupportId,
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
                string campaignLink = $"{_emailConfig.HomePage}/campaigns/{campain.CampaignRequestSupportId}";
                string body = htmlBody
                    .Replace("{{UserName}}", donor.FullName)
                    .Replace("{{CampaignName}}", campain.CampaignRequestSupportName)
                    .Replace("{{CampaignLink}}", campaignLink);

                string subject = "Chiến dịch của bạn cần được bổ sung thêm - FDS-System";
                await _emailHeper.SendEmailAsync(subject, body, new List<string> { donor.Email }, true);
            }

        }

        public async Task Cancel(CancelCampaignRequestSupportDto cancelCampaignRequestSupportDto)
        {
            var filter = Builders<CampaignRequestSupport>.Filter.Eq(c => c.CampaignRequestSupportId, cancelCampaignRequestSupportDto.CampaignRequestSupportId);
            var campain = (await _campaignRequestSupportRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Canceled";
            campain.CancelComment = cancelCampaignRequestSupportDto.Comment;
            await _campaignRequestSupportRepository.UpdateAsync(campain.Id, campain);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffAndRecipientId();
            foreach (var user in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Chiến dịch mới được cập nhật",
                    Content = "có chiến dịch mới vừa được cập nhật",
                    NotificationType = "Cancel",
                    ObjectType = "CampainRequestSupport",
                    OjectId = campain.CampaignRequestSupportId,
                    AccountId = user.AccountId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }

        public async Task<int> GetCreatedNumberByUserId(string userId)
        {
            var filter = Builders<CampaignRequestSupport>.Filter.Eq(c => c.AccountId, userId);
            var campaigns = await _campaignRequestSupportRepository.GetAllAsync(filter);
            return campaigns.Count();
        }
    }
}