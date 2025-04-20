using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace FDSSYSTEM.Models
{
    public class DonorQuestion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string DonorQuestionId { get; set; }
        public string DonorId { get; set; }
        public string QuestionContent { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
