namespace FDSSYSTEM.DTOs
{
    public class RegisterPersonalDonorDto: RegisterUserDto
    {    
        public string CCCD { get; set; }
        public List<string> Images { get; set; } = new List<string>();
    }
}
