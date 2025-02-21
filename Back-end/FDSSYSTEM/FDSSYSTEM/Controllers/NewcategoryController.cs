using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    public class NewcategoryController : Controller
    {
        // GET: NewcategoryController
        public ActionResult Index()
        {
            return View();
        }

        // GET: NewcategoryController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: NewcategoryController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: NewcategoryController/Create
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

        // GET: NewcategoryController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: NewcategoryController/Edit/5
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

        // GET: NewcategoryController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: NewcategoryController/Delete/5
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
