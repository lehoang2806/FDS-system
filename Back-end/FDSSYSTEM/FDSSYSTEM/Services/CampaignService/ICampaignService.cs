using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.CampaignService
{
    public interface ICampaignService
    {
        Task<List<CampaignWithCreatorDto>> GetAll();
        Task<CampaignWithCreatorDto> GetCampaignById(string id);
        Task<Campaign> GetCampaignById(string id, bool isRaw);
        Task Create(CampaignDto campaign);
        Task Update(string id, CampaignDto campaign);
        Task Approve(ApproveCampaignDto approveCampaignDto);
        Task Reject(RejectCampaignDto rejectCampaignDto);
        Task DeleteByCampaignId(string campaignId); // Sửa đổi tên phương thức
        Task AddReviewComment(ReviewCommentCampaignDto reviewCommentCampaignDto);
        Task Cancel(CancelCampaignDto cancelCampaignDto);
        Task<int> GetCreatedNumberByUserId(string userId);
    }
}