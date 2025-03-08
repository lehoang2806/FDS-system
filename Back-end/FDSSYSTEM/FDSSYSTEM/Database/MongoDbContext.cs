using FDSSYSTEM.Models;
using MongoDB.Driver;

namespace FDSSYSTEM.Database;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    private readonly IConfiguration _configuration;

    public MongoDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
        var connectionString = _configuration.GetSection("Database:MongoDbConnection").Value;
        var dbName = _configuration.GetSection("Database:DatabaseName").Value;
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(dbName);
    }

    public IMongoDatabase Database => _database;
    public IMongoCollection<New> New => _database.GetCollection<New>("News");  // Đảm bảo News là IMongoCollection<News>
}
