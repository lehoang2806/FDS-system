using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Feedback
{
    public int AccountId { get; set; }

    public int FeedbackId { get; set; }

    public string? FeedbackText { get; set; }

    public string? FeedbackType { get; set; }

    public DateTime? DateSubmitted { get; set; }

    public int EventId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Campaign FeedbackNavigation { get; set; } = null!;
}
