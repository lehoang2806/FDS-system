namespace FDSSYSTEM.DTOs
{
    public class RegisterOrganizationDonorDto: RegisterUserDto
    {
        public string OrganizationName { get; set; }
        public string TaxIdentificationNumber { get; set; }
    }
}
