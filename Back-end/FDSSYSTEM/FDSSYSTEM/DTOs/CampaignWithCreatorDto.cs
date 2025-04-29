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

        public string CampaignName { get; set; }

        public string CampaignDescription { get; set; }

        public string Location { get; set; }

        public string ImplementationTime { get; set; }

       /* public string TypeGift { get; set; }*/
        public string EstimatedBudget { get; set; }
        public string AverageCostPerGift { get; set; }
        public string Sponsors { get; set; }
        public string ImplementationMethod { get; set; }
        public string Communication { get; set; }
        public int LimitedQuantity { get; set; }
        /*public string CampaignType { get; set; } // giới hạn quà tặng, đăng ký thoải mái*/
       /* public string StartRegisterDate { get; set; }*/
       /* public string EndRegisterDate { get; set; }*/
        public List<string> Images { get; set; }
        public string RejectComment { get; set; }
        public string CancelComment { get; set; }
        public string TypeAccount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public string District { get; set; }
        public List<CampaignReViewComment> ReviewComments { get; set; }
    }
    public class CampaignReViewComment
    {
        public DateTime CreatedDate { get; set; }
        public string Content { get; set; }
    }
}
