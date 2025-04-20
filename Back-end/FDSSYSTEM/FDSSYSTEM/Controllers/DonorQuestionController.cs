using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.DonorQuestion;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Options;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.DonorQuestionService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/donorquestion")]
    public class DonorQuestionController : BaseController
    {
        private readonly IDonorQuestionService _donorQuestionService;


        public DonorQuestionController(IDonorQuestionService donorQuestionService)
        {
            _donorQuestionService = donorQuestionService;
        }

        [HttpPost("CreateQuestion")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> CreateQuestion(DonorQuestionDto donorQuestion)
        {
            try
            {
                await _donorQuestionService.CreateDonorQuestionAsync(donorQuestion);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllDonorQuestion")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> GetAllDonorQuestion()
        {
            try
            {
                var donorQuestions = await _donorQuestionService.GetAllDonorQuestionsAsync();
                return Ok(donorQuestions);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
