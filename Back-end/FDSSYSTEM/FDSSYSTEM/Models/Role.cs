using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public int? Status { get; set; }

    public string? UserCreated { get; set; }

    public DateTime? DateCreated { get; set; }

    public string? UserUpdated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? IsDelete { get; set; }

    public string? UserDelete { get; set; }

    public DateTime? DateDelete { get; set; }

    public virtual Account? Account { get; set; }
}
