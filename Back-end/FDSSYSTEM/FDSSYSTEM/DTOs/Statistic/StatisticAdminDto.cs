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
        public int NumberOfCampaignStaffCreated { get; set; } //số lượng chiến dịch  staff đã tạo
        public int NumberOfCampaignPersonalDonorCreated { get; set; } //số lượng chiến dịch  person donor đã tạo 
        public int NumberOfCampaignOrganizaionDonorCreated { get; set; } //số lượng chiến dịch  OrganizaionDonor đã tạo 
        public int NumberOfRegisterReceiver { get; set; }// sô lượng người đăng ký nhận
        public int NumberOfPersonalDonorCertificate { get; set; } // số lượng chứng nhận personaldonor
        public int NumberOfOrganizaionDonorCertificate { get; set; } // số lượng chứng nhận organization
        public int NumberOfRecipientCertificate { get; set; } // số lượng chứng nhận recipient
        public int NumberOfGiftOfPersonalDonor { get; set; } // số lượng quà trong campaign
        public int NumberOfGiftOrganizaionDonor { get; set; }
        public int NumberOfGiftStaff { get; set; }
        public long AmountOfSupportForTheSystem { get; set; }
        public int NumberOfAllPersonalDonorMember { get; set; }
        public int NumberOfAllOrganizaionDonorMember { get; set; }
        public int NumberOfAllRecipientMember { get; set; }
        public int NumberOfAllStaffMember { get; set; }
        public int NumberOfGiftRegisterReceiver { get; set; }// số lượng quà đăng ký nhận
        public int NumberGiftRegisterReceiver { get; set; } // số lượng người đăng ký nhận
    }
}
