namespace FDSSYSTEM.DTOs
{
    public class CampaignWithCreatorDto
    {
        public string CampaignId { get; set; }

        public string AccountId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public int RoleId { get; set; }

        public string NameCampaign { get; set; }

        public string Description { get; set; }

        public string GiftType { get; set; }

        public int GiftQuantity { get; set; }

        public string Address { get; set; }

        public DateTime ReceiveDate { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime? DateUpdated { get; set; }

        public bool? IsDeleted { get; set; }
        public string Status { get; set; } = "Pending";
        public string TypeAccount { get; set; }
        public string RejectComment { get; set; }
        public bool IsReceiveMulti { get; set; }
        public string StartRegisterDate { get; set; }
        public string EndRegisterDate { get; set; }
        public string Image { get; set; }
        public bool TypeCampaign { get; set; }
    }
}
