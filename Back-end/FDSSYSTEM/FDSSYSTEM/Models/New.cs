using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class New
{
    public int NewId { get; set; }

    public int NewCategoryId { get; set; }

    public int AccountId { get; set; }

    public string Title { get; set; } = null!;

    public string? Subtitle { get; set; }

    public string? Image { get; set; }

    public string Content { get; set; } = null!;

    public string? Status { get; set; }

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Newcategory NewCategory { get; set; } = null!;
}
