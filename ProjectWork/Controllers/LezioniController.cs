using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectWork.classi;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LezioniController : ControllerBase
    {
        private readonly AvocadoDBContext _context;
        public LezioniController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/lezioni
        [HttpGet]
        public IEnumerable<Lezioni> GetLezioni()
        {
            var calendar = new CalendarApi(_context);
            calendar.GetCalendarEvents();
            return _context.Lezioni;
        }

        // POST: api/lezioni
        //[HttpPost]
        //public IActionResult PostLezioni()
        //{
            
        //    return RedirectToAction("GetLezioni");
        //}

        
    }
}