using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Fooddonation
{
    public int FoodId { get; set; }

    public int AccountId { get; set; }

    public string FoodName { get; set; } = null!;

    public int Quantity { get; set; }

    public DateOnly? ExpirationDate { get; set; }

    public string? Status { get; set; }

    public DateTime? DateDonated { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
