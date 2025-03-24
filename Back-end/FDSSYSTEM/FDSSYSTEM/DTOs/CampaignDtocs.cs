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
        public string StartRegisterDate { get; set; }
        public string EndRegisterDate { get; set; }
        public List<string> Images { get; set; } = new List<string>();
        public string TypeCampaign { get; set; }

    }
}
