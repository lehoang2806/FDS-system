using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Account
{
    public int AccountId { get; set; }

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

    public virtual Role AccountNavigation { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Fooddonation> Fooddonations { get; set; } = new List<Fooddonation>();

    public virtual ICollection<New> News { get; set; } = new List<New>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Postcomment> Postcomments { get; set; } = new List<Postcomment>();

    public virtual ICollection<Postfavourite> Postfavourites { get; set; } = new List<Postfavourite>();

    public virtual ICollection<Postlike> Postlikes { get; set; } = new List<Postlike>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
