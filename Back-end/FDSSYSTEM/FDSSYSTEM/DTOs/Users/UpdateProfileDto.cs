namespace FDSSYSTEM.DTOs.Users
{
    public class UpdateProfileDto
    {
        public string FullName { get; set; }
        public string BirthDay { get; set; }

        public string? Phone { get; set; }

        public string? Avatar { get; set; }

        public string? Gender { get; set; }
        public string? Address { get; set; }
    }
}
