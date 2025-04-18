using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace FDSSYSTEM.Models
{
    public class PostCommentLike
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string PostCommentLikeId { get; set; }
        public string PostCommentId { get; set; }
        public string ReplyPostCommentId { get; set; }
        public string AccountId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
