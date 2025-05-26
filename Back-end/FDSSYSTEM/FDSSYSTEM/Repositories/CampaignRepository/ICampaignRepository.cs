using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.CampaignRepository
{
    public interface ICampaignRepository : IMongoRepository<Campaign>
    {
        Task<Campaign> GetLatestAsync();
        Task DeleteByCampaignIdAsync(string campaignId); // Thêm phương thức mới
    }
}