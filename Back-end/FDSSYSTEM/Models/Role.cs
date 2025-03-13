using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Role
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public int RoleId { get; set; } 

    public string RoleName { get; set; } = null!;// "Admin", "Staff", "Donor", "Recipient"

}
