using FDSSYSTEM.DTOs;
using FDSSYSTEM.Services.NewOfInterest;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/NewOfInterest")]
    [ApiController]
    public class NewOfInterestController : ControllerBase
    {
        private readonly INewOfInterestService _newOfInterestService;

        public NewOfInterestController(INewOfInterestService newOfInterestService)
        {
            _newOfInterestService = newOfInterestService;
        }

        [HttpPost("NewOfInterest/{newId}")]
        public async Task<IActionResult> NewOfInterest(string newId)
        {
            await _newOfInterestService.NewOfInterest(newId);
            return Ok(new { message = "Post saved successfully" });
        }

        [HttpDelete("UnNewOfInterest/{newId}")]
        public async Task<IActionResult> UnNewOfInterest(string newId)
        {
            await _newOfInterestService.UnNewOfInterest(newId);
            return Ok(new { message = "Post unsaved successfully" });
        }

    }
}
