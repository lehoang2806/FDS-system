using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;

namespace FDSSYSTEM.Models
{
    public class RegisterReceiver
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string AccountId { get; set; }
        public string RegisterReceiverId { get; set; }
        public string RegisterReceiverName { get; set; }
        public int Quantity { get; set; }
        public string CreatAt { get; set; }
        public DateTime? DateUpdated { get; set; }
        public string CampaignId { get; set; }
        public bool IsReceived { get; set; } = false; // false là user chưa nhận, true là nhận rồi
    }
}
