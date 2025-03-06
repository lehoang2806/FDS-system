using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class OrderitemController : Controller
    {
        // GET: OrderitemController
        public ActionResult Index()
        {
            return View();
        }

        // GET: OrderitemController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: OrderitemController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: OrderitemController/Create
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

        // GET: OrderitemController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: OrderitemController/Edit/5
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

        // GET: OrderitemController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: OrderitemController/Delete/5
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
