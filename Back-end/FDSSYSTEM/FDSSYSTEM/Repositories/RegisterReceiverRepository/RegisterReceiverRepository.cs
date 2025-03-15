using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.RoleRepository;

namespace FDSSYSTEM.Repositories.RegisterReceiverRepository
{
    public class RegisterReceiverRepository : MongoRepository<RegisterReceiver>, IRegisterReceiverRepository
    {
        MongoDbContext _dbContext;
        public RegisterReceiverRepository(MongoDbContext dbContext) : base(dbContext.Database, "RegisterReceiver")
        {
            _dbContext = dbContext;
        }
        public Task<RegisterReceiver> GetLatestAsync()
        {
            throw new NotImplementedException();
        }
    }
}
