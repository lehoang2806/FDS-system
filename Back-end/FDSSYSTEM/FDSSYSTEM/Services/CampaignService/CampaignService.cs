using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using Mapster;
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

        public CampaignService(ICampaignRepository campaignRepository, IUserRepository userRepository
            , IUserContextService userContextService, IUserService userService)
        {
            _campaignRepository = campaignRepository;
            _userRepository = userRepository;
            _userContextService = userContextService;
            _userService = userService;
        }

        public async Task Create(CampaignDto campaign)
        {
            var donorType = _userContextService.Role ?? "";
            if (!string.IsNullOrEmpty(donorType) && donorType.Equals("Donor"))
            {
               var user = await  _userService.GetAccountById(_userContextService.UserId ?? "");
                if (user != null)
                {
                    donorType = user.DonorType;
                }
            }

            await _campaignRepository.AddAsync(new Campaign
            {
                CampaignId = Guid.NewGuid().ToString(),
                AccountId = _userContextService.UserId ?? "",
                NameCampaign = campaign.NameCampaign,
                Description = campaign.Description,
                GiftType = campaign.GiftType,
                GiftQuantity = campaign.GiftQuantity,
                Address = campaign.Address,
                ReceiveDate = campaign.ReceiveDate,
                DateCreated = DateTime.Now,
                IsDeleted = false,
                Status = "Pending",// Nếu không truyền, mặc định là "Pending",
                TypeAccount = donorType, //staff, personal , organization
                StartRegisterDate = campaign.StartRegisterDate,
                EndRegisterDate = campaign.EndRegisterDate,
                Images = campaign.Images,
                TypeCampaign = campaign.TypeCampaign,
            });
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
                existingCampaign.NameCampaign = campaign.NameCampaign;
                existingCampaign.Description = campaign.Description;
                existingCampaign.GiftType = campaign.GiftType;
                existingCampaign.GiftQuantity = campaign.GiftQuantity;
                existingCampaign.Address = campaign.Address;
                existingCampaign.ReceiveDate = campaign.ReceiveDate;
                existingCampaign.DateUpdated = DateTime.Now;
                existingCampaign.StartRegisterDate = campaign.StartRegisterDate;
                existingCampaign.EndRegisterDate = campaign.EndRegisterDate;
                existingCampaign.Images = campaign.Images;
                existingCampaign.TypeCampaign = campaign.TypeCampaign;

                await _campaignRepository.UpdateAsync(existingCampaign.Id, existingCampaign);
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
                if(cretor != null)
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
        }

        public async Task Reject(RejectCampaignDto rejectCampaignDto)
        {
            var filter = Builders<Campaign>.Filter.Eq(c => c.CampaignId, rejectCampaignDto.CampaignId);
            var campain = (await _campaignRepository.GetAllAsync(filter)).FirstOrDefault();

            campain.Status = "Rejected";
            campain.RejectComment = rejectCampaignDto.Comment;
            await _campaignRepository.UpdateAsync(campain.Id, campain);
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
                    Content= reviewCommentCampaignDto.Content,
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
        }
    }
}