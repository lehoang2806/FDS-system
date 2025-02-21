using MongoDB.Driver;

public class MongoDBConnection
{
    private readonly IMongoDatabase _database;

    public MongoDBConnection()
    {
        string connectionString = "mongodb://localhost:27017";
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase("FDSSystem");
    }

    public IMongoCollection<T> GetCollection<T>(string collectionName)
    {
        return _database.GetCollection<T>(collectionName);
    }
}
