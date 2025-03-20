using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.NotificationCampaignRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using Mapster;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Services.NotificationCampaignService
{
    public class NotificationCampaignService : INotificationCampaignService
    {
        private readonly INotificationCampaignRepostoy _notificationCampaignRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;

        public NotificationCampaignService(INotificationCampaignRepostoy notificationCampaignRepostoy, IUserRepository userRepository
            , IUserContextService userContextService, IUserService userService)
        {
            _notificationCampaignRepository = notificationCampaignRepostoy;
            _userRepository = userRepository;
            _userContextService = userContextService;
            _userService = userService;
        }

        public async Task CreateDonorCampaignNotification(NotificationCampaignDto notificationCampaignDto)
        {
            await _notificationCampaignRepository.AddAsync(new NotificationCampaign
            {
                NotificationCampaignId = Guid.NewGuid().ToString(),
                AccountId = _userContextService.UserId ?? "",
                Content = notificationCampaignDto.Content,
                TypeAccount = notificationCampaignDto.TypeAccount,
                CampaignId = notificationCampaignDto.CampaignId,

            });
        }

        public async Task CreateRecipientCampaignNotification(NotificationCampaignDto notificationCampaignDto)
        {
            await _notificationCampaignRepository.AddAsync(new NotificationCampaign
            {
                NotificationCampaignId = Guid.NewGuid().ToString(),
                AccountId = _userContextService.UserId ?? "",
                Content = notificationCampaignDto.Content,
                TypeAccount = notificationCampaignDto.TypeAccount,
                CampaignId = notificationCampaignDto.CampaignId,

            });
        }

        public async Task CreateStaffCampaignNotification(NotificationCampaignDto notificationCampaignDto)
        {
            await _notificationCampaignRepository.AddAsync(new NotificationCampaign
            {
                NotificationCampaignId = Guid.NewGuid().ToString(),
                AccountId = _userContextService.UserId ?? "",
                Content = notificationCampaignDto.Content,
                TypeAccount = notificationCampaignDto.TypeAccount,
                CampaignId = notificationCampaignDto.CampaignId,

            });
        }

        public async Task<List<NotificationCampaignWithCreatorDto>> GetAll()
        {
            var rs = new List<NotificationCampaignWithCreatorDto>();

            var allCampaign = await _notificationCampaignRepository.GetAllAsync();
            var listCreatorId = allCampaign.Select(c => c.AccountId).Distinct().ToList();

            var creatorFilter = Builders<Account>.Filter.In(c => c.AccountId, listCreatorId);
            var allCreator = await _userRepository.GetAllAsync(creatorFilter);

            foreach (var cp in allCampaign)
            {
                var cpDto = cp.Adapt<NotificationCampaignWithCreatorDto>();
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
    }
}
