using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.ChatMessageRepository;

public interface IChatMessageRepository: IMongoRepository<ChatMessage>
{
}
