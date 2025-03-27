using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.CampaignService
{
    public class CampaignService : ICampaignService
    {
        private readonly ICampaignRepository _campaignRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;
        private readonly INotificationService _notificationService;

        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public CampaignService(ICampaignRepository campaignRepository, IUserRepository userRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext)
        {
            _campaignRepository = campaignRepository;
            _userRepository = userRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;
        }

        public async Task Create(CampaignDto campaign)
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

            var newCampain = new Campaign
            {
                CampaignId = Guid.NewGuid().ToString(),
                AccountId = _userContextService.UserId ?? "",
                CampaignName = campaign.CampaignName,
                CampaignDescription = campaign.CampaignDescription,
                Location = campaign.Location,
                ImplementationTime = campaign.ImplementationTime,
                TypeGift = campaign.TypeGift,
                DateUpdated = campaign.DateUpdated,
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
                CreatedDate = campaign.CreatedDate,
               
            };

            await _campaignRepository.AddAsync(newCampain);

            //Send notifiction all staff and admin
            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Campain mới được tạo",
                    Content = "Có chiến dịch mới được tạo ra",
                    CreatedDate = DateTime.Now,
                    NotificationType = "Approve",
                    ObjectType = "Campain",
                    OjectId = newCampain.CampaignId,
                    AccountId = userId
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
            var existingCampaign = await GetCampaignById(id);
            if (existingCampaign != null)
            {
                existingCampaign.CampaignName = campaign.CampaignName;
                existingCampaign.CampaignDescription = campaign.CampaignDescription;
                existingCampaign.Location = campaign.Location;
                existingCampaign.ImplementationTime = campaign.ImplementationTime;
                existingCampaign.TypeGift = campaign.TypeGift;
                existingCampaign.DateUpdated = campaign.DateUpdated;
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
                existingCampaign.CreatedDate = campaign.CreatedDate;

                await _campaignRepository.UpdateAsync(existingCampaign.Id, existingCampaign);

            }

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Campain mới được update",
                    Content = "có chiến dịch mới vừa được cập nhật",
                    CreatedDate = DateTime.Now,
                    NotificationType = "Approve",
                    ObjectType = "Campain",
                    OjectId = existingCampaign.CampaignId,
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
            await _campaignRepository.DeleteAsync(id);
        }

        public async Task<Campaign> GetCampaignById(string id)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, id);
            var getbyId = await _campaignRepository.GetAllAsync(filter);
            return getbyId.FirstOrDefault();
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

        public async Task Approve(ApproveCampaignDto approveCampaignDto)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, approveCampaignDto.CampaignId);
            var campain = (await _campaignRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Approved";
            await _campaignRepository.UpdateAsync(campain.Id, campain);

            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Đã approve",
                Content = "Chiến dịch của bạn đã được phê duyệt thành công",
                CreatedDate = DateTime.Now,
                NotificationType = "Approve",
                ObjectType = "Campain",
                OjectId = campain.CampaignId,
                AccountId = campain.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
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
                Title = "Đã reject",
                Content = "Rất tiếc chiến dịch của bạn không phù hợp.Bạn có thể xem lý do ",
                CreatedDate = DateTime.Now,
                NotificationType = "Approve",
                ObjectType = "Campain",
                OjectId = campain.CampaignId,
                AccountId = campain.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
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
        }

        public async Task Cancel(CancelCampaignDto cancelCampaignDto)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, cancelCampaignDto.CampaignId);
            var campain = (await _campaignRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Canceled";
            campain.CancelComment = cancelCampaignDto.Comment;
            await _campaignRepository.UpdateAsync(campain.Id, campain);

            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Đã cancel",
                Content = "Chiến dịch của bạn đã được hủy bỏ",
                CreatedDate = DateTime.Now,
                NotificationType = "Approve",
                ObjectType = "Campain",
                OjectId = campain.CampaignId,
                AccountId = campain.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        }
    }
}