using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.PostRepository
{
    public interface IPostRepository : IMongoRepository<Post>
    {
       // Task<Post> GetMostAsync();
    }
}
