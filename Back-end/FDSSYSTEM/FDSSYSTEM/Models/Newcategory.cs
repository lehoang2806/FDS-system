using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Newcategory
{
    public int NewCategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Status { get; set; }

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public virtual ICollection<New> News { get; set; } = new List<New>();
}
