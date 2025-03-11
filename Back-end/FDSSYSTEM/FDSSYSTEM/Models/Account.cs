using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Account
{
    [BsonId] 
    [BsonRepresentation(BsonType.ObjectId)] 
    public string Id { get; set; }

    public string AccountId { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string? FullName { get; set; }

    public DateOnly? BirthDay { get; set; }

    public string? Phone { get; set; }

    public string? Avatar { get; set; }

    public string? Gender { get; set; }

    public string? Status { get; set; }

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public int RoleId { get; set; }

    public string? Address { get; set; }

    public string CCCD { get; set; }
    public string TaxIdentificationNumber { get; set; }
    public string OrganizationName { get; set; }

    public bool IsConfirm { get; set; }

}
