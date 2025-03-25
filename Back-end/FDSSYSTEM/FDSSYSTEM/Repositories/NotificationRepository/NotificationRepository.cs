using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.NotificationRepository;

public class NotificationRepository : MongoRepository<Notification>, INotificationRepository
{
    MongoDbContext _dbContext;

    public NotificationRepository(MongoDbContext dbContext) : base(dbContext.Database, "Notification")
    {
        _dbContext = dbContext;
    }
}
