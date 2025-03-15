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

    public string? FileComment { get; set; }

    public string? Status { get; set; }

    public DateTime? CommentDate { get; set; }

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Post Post { get; set; } = null!;
    public string CommentId { get; internal set; }
}
