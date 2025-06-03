using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.CampaignRepository
{
    public interface ICampaignRequestSupportRepository : IMongoRepository<CampaignRequestSupport>
    {
        Task<CampaignRequestSupport> GetLatestAsync();
        Task DeleteByCampaignRequestSupportIdAsync(string campaignRequestSupportId); // Thêm phương thức mới
    }
}