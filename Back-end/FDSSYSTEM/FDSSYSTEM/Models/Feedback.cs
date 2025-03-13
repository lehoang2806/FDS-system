using System;
using System.Collections.Generic;

namespace FDSSYSTEM.Models;

public partial class Feedback
{
    public int AccountId { get; set; }

    public int FeedbackId { get; set; }

    public string? FeedbackText { get; set; }


    public DateTime? DateSubmitted { get; set; }

    public int CampaignId { get; set; }

 
}
