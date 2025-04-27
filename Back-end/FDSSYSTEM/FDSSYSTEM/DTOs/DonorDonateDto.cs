using System;

namespace FDSSYSTEM.DTOs
{
    public class DonorDonateDto
    {
        public string? DonorId { get; set; }
        public decimal Amount { get; set; }
        public string Message { get; set; }
        public string TransactionId { get; set; }
        public DateTime DonateDate { get; set; }
    }
}