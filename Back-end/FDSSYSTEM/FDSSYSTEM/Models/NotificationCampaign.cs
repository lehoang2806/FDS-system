using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
namespace FDSSYSTEM.Models;

public class NotificationCampaign
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]

    public string Id { get; set; }
    public string NotificationCampaignId {  get; set; }
    public string AccountId { get; set; }
    public string CampaignId { get; set; }
    public string TypeAccount {  get; set; }
    public string Content { get; set; }
}
