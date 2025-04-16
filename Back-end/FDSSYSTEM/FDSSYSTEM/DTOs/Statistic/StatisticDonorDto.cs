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
        public int NumberOfCampaignsGenerated { get; set; }
        public int NumberOfGift { get; set; }
        public int NumberOfCampaignParticipants { get; set; }
        public long AmountOfSupportForTheSystem { get; set; }
    }
}
