using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.NewRepository
{
    public interface INewRepository : IMongoRepository<New>
    {
    }
}
