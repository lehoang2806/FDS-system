using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace FDSSYSTEM.Models
{
    public class DonorDonate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string DonorDonateId { get; set; }
        public string DonorId { get; set; }
        public decimal Amount { get; set; }
        public string Message { get; set; }
        public string TransactionId { get; set; }
        public DateTime DonateDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsPaid { get; set; }
    }
}
