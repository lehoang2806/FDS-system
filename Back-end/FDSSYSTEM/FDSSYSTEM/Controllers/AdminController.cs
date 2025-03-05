using FDSSYSTEM.Services.PostService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        //private readonly PostService _postService;

        //public AdminController(PostService postService)
        //{
        //    _postService = postService;
        //}

        //public IActionResult PendingPosts()
        //{
        //    var posts = _postService.GetPendingPosts();
        //    return View(posts);
        //}

        //[HttpPost]
        //public IActionResult Approve(string id)
        //{
        //    _postService.ApprovePost(id);
        //    return RedirectToAction("PendingPosts");
        //}

        //[HttpPost]
        //public IActionResult Reject(string id)
        //{
        //    _postService.RejectPost(id);
        //    return RedirectToAction("PendingPosts");
        //}
    }
}
