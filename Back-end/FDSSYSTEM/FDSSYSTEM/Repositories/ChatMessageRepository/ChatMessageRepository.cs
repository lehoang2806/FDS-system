using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.ChatMessageRepository;

public class ChatMessageRepository : MongoRepository<ChatMessage>, IChatMessageRepository
{
    MongoDbContext _dbContext;

    public ChatMessageRepository(MongoDbContext dbContext) : base(dbContext.Database, "ChatMessage")
    {
        _dbContext = dbContext;
    }
}

