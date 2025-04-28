using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.DonorDonateRepository
{
    public interface IDonorDonateRepository : IMongoRepository<DonorDonate>
    {
        Task<DonorDonate> GetByIdAsync(string id);
        Task DeleteAsync(FilterDefinition<DonorDonate> filter);
    }
}