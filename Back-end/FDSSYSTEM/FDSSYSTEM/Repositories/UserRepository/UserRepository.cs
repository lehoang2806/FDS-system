
using FDSSYSTEM.Database;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Driver;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;

namespace FDSSYSTEM.Repositories.UserRepository;

public class UserRepository : MongoRepository<Account>, IUserRepository
{
    MongoDbContext _dbContext;
    public UserRepository(MongoDbContext dbContext) : base(dbContext.Database, "Account")
    {
        _dbContext = dbContext; 
    }

    
}
