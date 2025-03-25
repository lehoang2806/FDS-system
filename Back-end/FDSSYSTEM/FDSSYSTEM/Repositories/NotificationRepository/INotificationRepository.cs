using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.NotificationRepository;

public interface INotificationRepository : IMongoRepository<Notification>
{
}
