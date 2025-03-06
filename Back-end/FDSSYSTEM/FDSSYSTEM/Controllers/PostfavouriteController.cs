using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class PostfavouriteController : Controller
    {
        // GET: PostfavouriteController
        public ActionResult Index()
        {
            return View();
        }

        // GET: PostfavouriteController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PostfavouriteController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PostfavouriteController/Create
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

        // GET: PostfavouriteController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PostfavouriteController/Edit/5
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

        // GET: PostfavouriteController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PostfavouriteController/Delete/5
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
