﻿using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class CampaignFeedBack
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public required string FeedBackId { get; set; }

    public string CampaignId { get; set; }

    public string AccountId { get; set; }

    public string? Content { get; set; }


    public List<string> Images { get; set; }
    
    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public List<ReplyFeedBack> Replies { get; set; }
}

public class ReplyFeedBack
{
    public string ReplyFeedBackId { get; set; }

    public string AccountId { get; set; }

    public string? Content { get; set; }
    public List<string> Images { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

}
