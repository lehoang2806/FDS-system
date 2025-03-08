using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.NewRepository
{
    public interface INewRepository : IMongoRepository<New>
    {
        Task DeleteAsync(FilterDefinition<New> filter);
        Task<New> GetByIdAsync(string id);
    }
}
