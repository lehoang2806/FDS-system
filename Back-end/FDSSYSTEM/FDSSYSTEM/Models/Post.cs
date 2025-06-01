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


    public string Status { get; set; } = "Pending";  // Mặc định là chờ duyệt

    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public List<string> Images { get; set; }
    public string RejectComment { get; set; }
    public string ArticleTitle { get; set; }
    public string PosterName { get; set; }

    public string PostContent { get; set; } = null!;
    public string PublicDate { get; set; }
    public string PosterRole { get; set; }
    public string PosterApproverId { get; set; }
    public string PosterApproverName { get; set; }
    public List<string> Hashtags { get; set; } = new List<string>();

}
