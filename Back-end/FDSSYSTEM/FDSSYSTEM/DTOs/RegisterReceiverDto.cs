﻿namespace FDSSYSTEM.DTOs
{
    public class RegisterReceiverDto
    {
       
        public string RegisterReceiverName { get; set; }
        public int Quantity { get; set; }
        public string CreatAt { get; set; }
        public string CampaignId { get; set; }
        public string? UpdatedByDonorId { get; set; }
        public int ActualQuantity { get; set; }

    }
}
