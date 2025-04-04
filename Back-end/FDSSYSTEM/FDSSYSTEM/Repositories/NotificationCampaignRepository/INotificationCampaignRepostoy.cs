using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.NotificationCampaignRepository
{
    public interface INotificationCampaignRepostoy : IMongoRepository<NotificationCampaign>
    {
        Task<NotificationCampaign> GetNotificationCampaignIdAsync(string id);
    }
}
