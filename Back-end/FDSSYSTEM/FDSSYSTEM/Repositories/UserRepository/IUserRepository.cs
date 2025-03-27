using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.UserRepository;

public interface IUserRepository:IMongoRepository<Account>
{

}