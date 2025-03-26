namespace FDSSYSTEM.DTOs
{
    public class CampaignDto
    {
        public string NameCampaign { get; set; }
        public string Description { get; set; }
        public string GiftType { get; set; }
        public int GiftQuantity { get; set; }
        public string Address { get; set; }
        public DateTime ReceiveDate { get; set; }
        public bool IsReceiveMulti { get; set; }
        public string StartRegisterDate { get; set; }
        public string EndRegisterDate { get; set; }
        public string Image { get; set; }
        public bool TypeCampaign { get; set; }

    }
}
