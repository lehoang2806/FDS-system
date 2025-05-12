using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.CampaignService
{
    public interface ICampaignService
    {
        Task<List<CampaignWithCreatorDto>> GetAll();

        // Trả về CampaignWithCreatorDto để hiển thị thông tin chiến dịch + người tạo
        Task<CampaignWithCreatorDto> GetCampaignById(string id);

        // Trả về Campaign raw dùng cho xử lý nội bộ (update, v.v.)
        Task<Campaign> GetCampaignById(string id, bool isRaw);

        Task Create(CampaignDto campaign);
        Task Update(string id, CampaignDto campaign);
        Task Approve(ApproveCampaignDto approveCampaignDto);
        Task Reject(RejectCampaignDto rejectCampaignDto);
        Task Delete(string id);
        Task AddReviewComment(ReviewCommentCampaignDto reviewCommentCampaignDto);
        Task Cancel(CancelCampaignDto cancelCampaignDto);

        Task<int> GetCreatedNumberByUserId(string userId);
    }
}
