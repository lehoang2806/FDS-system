using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace FDSSYSTEM.Models
{
    public class CampaignFeedBackLike
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string FeedBackLikeId { get; set; }
        public string FeedBackId { get; set; }
        public string ReplyFeedBackId { get; set; }
        public string AccountId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
