namespace FDSSYSTEM.Options
{
    public class VnPaySetting
    {
        public string TmnCode { get; set; }
        public string HashSecret { get; set; }
        public string PaymentUrl { get; set; }
        public string FrontendReturnUrl { get; set; }
    }
}
