using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class OderController : Controller
    {
        // GET: OderController
        public ActionResult Index()
        {
            return View();
        }

        // GET: OderController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: OderController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: OderController/Create
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

        // GET: OderController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: OderController/Edit/5
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

        // GET: OderController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: OderController/Delete/5
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
