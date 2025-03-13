using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? Category { get; set; }

    public string? Img { get; set; }
    public string CampaignId { get; set; }
    public string Quantity { get; set; }

}
