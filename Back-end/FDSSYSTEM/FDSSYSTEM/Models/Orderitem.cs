using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Orderitem
{
    public int OrderItemId { get; set; }

    public int OrderId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal SubTotal { get; set; }

    public virtual ICollection<Eventorderitem> Eventorderitems { get; set; } = new List<Eventorderitem>();

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
