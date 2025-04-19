using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.CampaignDonorSupportRepository
{


    public interface ICampaignDonorSupportRepository : IMongoRepository<CampaignDonorSupport>
    {
        Task<List<CampaignDonorSupport>> GetByDonorIdAsync(string donorId); 
        Task<CampaignFeedBack> GetByFeedBackByIdAsync(string feedbackId);
    }
}
