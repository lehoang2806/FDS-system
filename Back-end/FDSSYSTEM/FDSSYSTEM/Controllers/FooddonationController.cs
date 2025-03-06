using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class FooddonationController : Controller
    {
        // GET: FooddonationController
        public ActionResult Index()
        {
            return View();
        }

        // GET: FooddonationController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: FooddonationController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: FooddonationController/Create
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

        // GET: FooddonationController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: FooddonationController/Edit/5
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

        // GET: FooddonationController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: FooddonationController/Delete/5
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
