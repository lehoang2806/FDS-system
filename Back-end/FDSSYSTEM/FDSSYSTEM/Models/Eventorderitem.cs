using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Eventorderitem
{
    public int EventOrderItemId { get; set; }

    public int? EventId { get; set; }

    public int? OrderItemId { get; set; }

    public int? Quantity { get; set; }

    public virtual Event? Event { get; set; }

    public virtual Orderitem? OrderItem { get; set; }
}
