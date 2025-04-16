namespace FDSSYSTEM.DTOs.Statistic
{
    public class StatisticAdminDto
    {

        public StatisticAdminItemDto Day { get; set; } = new();
        public StatisticAdminItemDto Week { get; set; } = new();
        public StatisticAdminItemDto Month { get; set; } = new();
        public StatisticAdminItemDto Year { get; set; } = new();
    }

    public class StatisticAdminItemDto
    {
        public int NumberOfCampaignDonorCreated { get; set; }
        public int NumberOfRegisterReceiver { get; set; }
        public int NumberOfCertificate { get; set; }
        public int NumberOfGift { get; set; }
        public long AmountOfSupportForTheSystem { get; set; }
        public int NumberOfAllMember { get; set; }
    }
}
