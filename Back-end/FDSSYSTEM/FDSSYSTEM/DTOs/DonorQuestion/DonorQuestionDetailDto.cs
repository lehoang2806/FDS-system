namespace FDSSYSTEM.DTOs.DonorQuestion
{
    public class DonorQuestionDetailDto
    {
        public string DonorQuestionId { get; set; }
        public string DonorId { get; set; }
        public string DonorFullName { get; set; }
        public string QuestionContent { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
