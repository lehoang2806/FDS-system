using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Event
{
    public int EventId { get; set; }

    public int AccountId { get; set; }

    public int FoodId { get; set; }

    public string EventName { get; set; } = null!;

    public DateTime EventDate { get; set; }

    public string? Location { get; set; }

    public string? Description { get; set; }

    public string? FeedbackId { get; set; }

    public string? Category { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Eventorderitem> Eventorderitems { get; set; } = new List<Eventorderitem>();

    public virtual Feedback? Feedback { get; set; }

    public virtual Fooddonation Food { get; set; } = null!;
}
