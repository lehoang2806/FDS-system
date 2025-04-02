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

    public string NewsTitle { get; set; } = null!;


    public string Status { get; set; } = "Pending";  // Trạng thái mặc định là Pending

    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public List<string> Images { get; set; }

    public string NewsDescripttion { get; set; }
    public string SupportBeneficiaries { get; set; }


    public string RejectComment { get; set; }

}
