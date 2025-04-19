using FDSSYSTEM.DTOs.CampaignDonorSupport;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.CampaignDonorSupportService
{
    public interface ICampaignDonorSupportService
    {
        Task RequestDonorSupportAsync(string campaignId);
        Task<List<CampaignSupportDetailDto>> GetAllCampaignDonorSupportAsync();
        Task<List<CampaignSupportDetailDto>> GetAllCampaignDonorSupportByDonorIdAsync(string donorId);
        Task AcceptRequestSupport(CampaignDonorSupportAcceptDto acceptDto);
        Task RejectRequestSupport(CampaignDonorSupportRejectDto rejectDto);

        Task<CampaignDonorSupport> GetCampaignDonorSupportByIdAsync(string campaingDonorSupportId);
    }
}
