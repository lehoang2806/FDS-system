﻿using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Postfavourite
{
    public int PostFavouriteId { get; set; }

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
