using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class PostlikeController : Controller
    {
        // GET: PostlikeController
        public ActionResult Index()
        {
            return View();
        }

        // GET: PostlikeController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PostlikeController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PostlikeController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: PostlikeController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PostlikeController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: PostlikeController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PostlikeController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
