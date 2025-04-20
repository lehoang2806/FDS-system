using FDSSYSTEM.DTOs.DonorQuestion;

namespace FDSSYSTEM.Services.DonorQuestionService
{
    public interface IDonorQuestionService
    {
        Task CreateDonorQuestionAsync(DonorQuestionDto donorQuestionDto);
        Task<List<DonorQuestionDetailDto>> GetAllDonorQuestionsAsync();
    }
}
