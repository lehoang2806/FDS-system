namespace FDSSYSTEM.DTOs
{
    public class RegisterReceiverWithRecipientDto
    {
        public string RegisterReceiverId { get; set; }
        public string AccountId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public int RoleId { get; set; }
        public string Quantity { get; set; }
        public string CreatAt { get; set; }
        public string CampaignId { get; set; }
        public string RegisterReceiverName { get; set; }
        public string Code { get; set; }
        public string Status { get; set; }
        public int ActualQuantity { get; set; }
    }
}
