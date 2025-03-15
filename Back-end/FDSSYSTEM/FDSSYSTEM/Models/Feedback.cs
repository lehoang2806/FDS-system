using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Feedback
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string AccountId { get; set; }

    public string FeedbackId { get; set; }

    public string Image {get; set; }

    public string CampaignId { get; set; }

 
}
