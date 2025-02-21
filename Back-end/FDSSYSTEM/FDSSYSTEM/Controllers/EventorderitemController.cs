using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class EventorderitemController : Controller
    {
        // GET: EventorderitemController
        public ActionResult Index()
        {
            return View();
        }

        // GET: EventorderitemController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: EventorderitemController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: EventorderitemController/Create
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

        // GET: EventorderitemController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: EventorderitemController/Edit/5
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

        // GET: EventorderitemController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: EventorderitemController/Delete/5
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
