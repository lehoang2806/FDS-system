﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace FDSSYSTEM.Models
{
    public class NewOfInterest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string NewId { get; set; }
        public string AccountId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
