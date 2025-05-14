using System;
using System.ComponentModel.DataAnnotations;

namespace FDSSYSTEM.DTOs
{
    public class DonorDonateDto
    {
        [Range(50000,500000, ErrorMessage ="Số tiền từ 50.000 đến 500.000")]
        public decimal Amount { get; set; }
        public string Message { get; set; }
    }
}