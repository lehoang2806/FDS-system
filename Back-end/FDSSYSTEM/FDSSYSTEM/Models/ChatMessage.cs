using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models
{
    public class ChatMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ChatMessageId { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
