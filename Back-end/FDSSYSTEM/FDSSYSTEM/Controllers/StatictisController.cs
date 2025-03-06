using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class StatictisController : Controller
    {
        // GET: StatictisController
        public ActionResult Index()
        {
            return View();
        }

        // GET: StatictisController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: StatictisController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: StatictisController/Create
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

        // GET: StatictisController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: StatictisController/Edit/5
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

        // GET: StatictisController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: StatictisController/Delete/5
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
