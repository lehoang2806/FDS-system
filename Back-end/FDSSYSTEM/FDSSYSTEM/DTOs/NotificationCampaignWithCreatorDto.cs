namespace FDSSYSTEM.DTOs
{
    public class NotificationCampaignWithCreatorDto
    {
        public string CampaignId { get; set; }

        public string AccountId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string NotificationCampaignId { get; set; }
        public int RoleId { get; set; }
        public string Content { get; set; }
        public string TypeAccount { get; set; }
    }
}
