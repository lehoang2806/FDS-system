namespace FDSSYSTEM.DTOs
{
    public class RegisterUserDto
    {
        public string UserEmail { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public int RoleId { get; set; }
        public bool IsConfirm { get; set; }
        public string type { get; set; }
    }
}
