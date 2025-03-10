using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class New
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string NewId { get; set; }

    public string NewCategoryId { get; set; }

    public string AccountId { get; set; }

    public string Title { get; set; } = null!;

    public string? Subtitle { get; set; }

    public string? Image { get; set; }

    public string Content { get; set; } = null!;

    public string Status { get; set; } = "Pending";  // Trạng thái mặc định là Pending

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public string? PostText { get; set; }

    public string? PostFile { get; set; }

    public string PostId { get; set; }
    public string ApproveComment { get; set; }

}
