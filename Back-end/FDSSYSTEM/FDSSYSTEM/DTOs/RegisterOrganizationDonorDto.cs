namespace FDSSYSTEM.DTOs
{
    public class RegisterOrganizationDonorDto: RegisterUserDto
    {
        public string OrganizationName { get; set; }
        public string TaxIdentificationNumber { get; set; }
        public List<string> Images { get; set; } = new List<string>();
        public string RepresentativeName { get; set; }
        public string RepresentativePhone { get; set; }
        public string RepresentativeCitizenId { get; set; }
        public string RepresentativeEmail { get; set; }
    }
}
