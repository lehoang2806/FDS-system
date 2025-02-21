using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Report
{
    public int ReportId { get; set; }

    public int AccountId { get; set; }

    public int PostId { get; set; }

    public string? Status { get; set; }

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Post Post { get; set; } = null!;
}
