using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int AccountId { get; set; }

    public int FoodId { get; set; }

    public DateTime? OrderDate { get; set; }

    public string? Status { get; set; }

    public decimal TotalAmount { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Fooddonation Food { get; set; } = null!;

    public virtual ICollection<Orderitem> Orderitems { get; set; } = new List<Orderitem>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
