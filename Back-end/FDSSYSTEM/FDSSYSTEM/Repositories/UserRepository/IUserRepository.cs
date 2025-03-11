
using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.UserRepository;

public interface IUserRepository:IMongoRepository<Account>
{
    
}