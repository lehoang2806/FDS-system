using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;


namespace FDSSYSTEM.Repositories.NewRepository
{
    public class NewRepository : INewRepository
    {
        //private readonly IMongoCollection<News> _newsCollection;

        //public NewsRepository(MongoDbContext context)
        //{
        //    _newsCollection = context.News;
        //}

        //public async Task<List<News>> GetAll() =>
        //    await _newsCollection.Find(news => true).ToListAsync();

        //public async Task<News> GetById(string id) =>
        //    await _newsCollection.Find(news => news.Id == id).FirstOrDefaultAsync();

        //public async Task Create(News news) =>
        //    await _newsCollection.InsertOneAsync(news);

        //public async Task Update(string id, News news) =>
        //    await _newsCollection.ReplaceOneAsync(n => n.Id == id, news);

        //public async Task Delete(string id) =>
        //    await _newsCollection.DeleteOneAsync(n => n.Id == id);
    }

}
