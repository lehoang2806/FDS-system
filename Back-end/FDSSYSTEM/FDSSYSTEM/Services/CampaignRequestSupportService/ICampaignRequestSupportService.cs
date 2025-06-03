using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.CampaignRequestSupportService
{
    public interface ICampaignRequestSupportService
    {
        Task<List<CampaignWithCreatorDto>> GetAll();
        Task<CampaignWithCreatorDto> GetCampaignRequestSupportById(string id);
        Task<CampaignRequestSupport> GetCampaignRequestSupportById(string id, bool isRaw);
        Task Create(CampaignRequestSupportDto campaignRequestSupportDto);
        Task Update(string id, CampaignRequestSupportDto campaignRequestSupportDto);
        Task Approve(ApproveCampaignRequestSupportDto approveCampaignRequestSupportDto);
        Task Reject(RejectCampaignRequestSupportDto rejectCampaignRequestSupportDto);
        Task DeleteByCampaignRequestSupportId(string campaignRequestSupportId); // Sửa đổi tên phương thức
        Task AddReviewComment(ReviewCommentCampaignRequestSupportDto reviewCommentCampaignRequestSupportDto);
        Task Cancel(CancelCampaignRequestSupportDto cancelCampaignRequestSupportDto);
        Task<int> GetCreatedNumberByUserId(string userId);
    }
}