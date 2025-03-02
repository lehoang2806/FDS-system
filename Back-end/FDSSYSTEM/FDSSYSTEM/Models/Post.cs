using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Post
{
    public int PostId { get; set; }

    public int AccountId { get; set; }

    public string? PostText { get; set; }

    public string? PostFile { get; set; }

    public string? Status { get; set; }

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public int EventId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Postcomment> Postcomments { get; set; } = new List<Postcomment>();

    public virtual ICollection<Postfavourite> Postfavourites { get; set; } = new List<Postfavourite>();

    public virtual ICollection<Postlike> Postlikes { get; set; } = new List<Postlike>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
