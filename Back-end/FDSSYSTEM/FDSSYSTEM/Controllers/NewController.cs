using FDSSYSTEM.Models;
using FDSSYSTEM.Services.NewService;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/news")]
    [ApiController]
    public class NewController : Controller
    {
        //private readonly INewsService _newsService;

        //public NewsController(INewsService newsService)
        //{
        //    _newsService = newsService;
        //}

        //[HttpGet]
        //public async Task<ActionResult<List<News>>> GetAll() =>
        //    Ok(await _newsService.GetAll());

        //[HttpGet("{id}")]
        //public async Task<ActionResult<News>> GetById(string id) =>
        //    Ok(await _newsService.GetById(id));

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] News news)
        //{
        //    await _newsService.Create(news);
        //    return CreatedAtAction(nameof(GetById), new { id = news.Id }, news);
        //}

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(string id, [FromBody] News news)
        //{
        //    await _newsService.Update(id, news);
        //    return NoContent();
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(string id)
        //{
        //    await _newsService.Delete(id);
        //    return NoContent();
        //}
    }
}
