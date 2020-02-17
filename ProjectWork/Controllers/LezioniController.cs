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
            //SaveEventsInContext();
            return _context.Lezioni.OrderBy(l => l.Data);
            //return CalendarApi.GetCalendarEvents();
        }

        public void SaveEventsInContext()
        {
            var events = CalendarApi.GetCalendarEvents();
            foreach (var e in events)
            {
                var lezione = new Lezioni
                {
                    Titolo = e.summary,
                    Data = e.date,
                    OraInizio = e.start,
                    OraFine = e.end
                };

                _context.Lezioni.Add(lezione);
            }

            _context.SaveChanges();

        }


    }
}