using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class NewController : Controller
    {
        // GET: NewController
        public ActionResult Index()
        {
            return View();
        }

        // GET: NewController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: NewController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: NewController/Create
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

        // GET: NewController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: NewController/Edit/5
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

        // GET: NewController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: NewController/Delete/5
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
