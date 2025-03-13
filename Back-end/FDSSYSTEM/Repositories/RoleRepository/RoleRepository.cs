using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.RoleRepository
{
    public class RoleRepository : MongoRepository<Role>, IRoleRepository

    {
        MongoDbContext _dbContext;
        public RoleRepository(MongoDbContext dbContext) : base(dbContext.Database, "Role")
        {
            _dbContext = dbContext;
        }
    }
}
