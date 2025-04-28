namespace FDSSYSTEM.DTOs.Statistic
{
    public class StatisticDonorDto
    {
        public StatisticDonorItemDto Day { get; set; } = new();
        public StatisticDonorItemDto Week { get; set; } = new();
        public StatisticDonorItemDto Month { get; set; } = new();
        public StatisticDonorItemDto Year { get; set; }= new();
    }

    public class StatisticDonorItemDto
    {
        public int NumberOfCampaignsCreated { get; set; } // số lượng chiến dịch tạo ra
        public int NumberOfGift { get; set; } // số lượng quà ủng hộ
        public int NumberOfRecipientsParticipating {  get; set; } // số lượng recipeint tham gia trong chiến dịch donor tạo
        public decimal AmountOfSupportForTheSystem { get; set; } //tổng số tiền ủng hộ
    }
}
