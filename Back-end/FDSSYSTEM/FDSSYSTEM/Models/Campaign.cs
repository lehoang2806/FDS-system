using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Campaign
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public int CampaignId { get; set; }

    public int AccountId { get; set; }

    public int FoodId { get; set; }

    public string EventName { get; set; } = null!;

    public DateTime EventDate { get; set; }

    public string? Location { get; set; }

    public string? Description { get; set; }

    public string? FeedbackId { get; set; }

    public string? Category { get; set; }
    public string Status { get; set; } = "Pending";  // Trạng thái mặc định là Pending

    public virtual Account Account { get; set; } = null!;


 
}
