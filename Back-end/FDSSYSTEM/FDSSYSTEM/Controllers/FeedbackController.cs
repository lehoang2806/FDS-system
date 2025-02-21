using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class FeedbackController : Controller
    {
        // GET: FeedbackController
        public ActionResult Index()
        {
            return View();
        }

        // GET: FeedbackController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: FeedbackController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: FeedbackController/Create
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

        // GET: FeedbackController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: FeedbackController/Edit/5
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

        // GET: FeedbackController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: FeedbackController/Delete/5
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
