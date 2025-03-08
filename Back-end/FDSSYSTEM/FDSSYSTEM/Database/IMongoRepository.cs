using MongoDB.Driver;

namespace FDSSYSTEM.Database;

public interface IMongoRepository<T> where T:class
{
    Task<IEnumerable<T>> GetAllAsync(FilterDefinition<T> filter);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> GetByIdAsync(string id);
    Task AddAsync(T entity);
    Task UpdateAsync(string id, T entity);
    Task DeleteAsync(string id);
}
