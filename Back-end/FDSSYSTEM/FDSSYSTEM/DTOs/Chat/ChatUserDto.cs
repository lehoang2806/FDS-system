namespace FDSSYSTEM.DTOs.Chat
{
    public class ChatUserDto
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        // Thêm mới
        public int RoleId { get; set; }
        public string Email { get; set; }
    }
}
