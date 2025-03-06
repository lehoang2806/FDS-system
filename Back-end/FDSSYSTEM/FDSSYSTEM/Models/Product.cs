using System;
using System.Collections.Generic;

namespace FDSSystem.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public int OrderId { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal Price { get; set; }

    public decimal? PriceNew { get; set; }

    public string? Category { get; set; }

    public string? Img { get; set; }

    public virtual ICollection<Orderitem> Orderitems { get; set; } = new List<Orderitem>();

    public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
}
