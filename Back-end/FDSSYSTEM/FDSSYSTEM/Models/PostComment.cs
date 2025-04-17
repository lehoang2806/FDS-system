using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class PostComment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }  

    public string PostCommentId { get; set; }

    public string AccountId { get; set; }

    public required string PostId { get; set; }

    public string? Content { get; set; }


    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public List<ReplyPostComment> Replies { get; set; }
    public List<string?> Images { get; set; }
}

public class ReplyPostComment
{
    public string ReplyPostCommentId { get; set; }
    public string PostCommentId { get; set; }

    public string AccountId { get; set; }

    public string? Content { get; set; }


    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
    public List<string?> Images { get; set; }

}
