using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Post
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string PostId { get; set; }

    public string AccountId { get; set; }

    public string? PostText { get; set; }

    public string? PostFile { get; set; }

    public string Status { get; set; } = "Pending";  // Mặc định là chờ duyệt

    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public List<string> Images { get; set; }
    public string RejectComment { get; set; }

    public string? Image { get; set; }

    public string Content { get; set; } = null!;

}
