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

        
        // GET: api/Lezioni/GetLezioniByDocente/IdDoc
        [HttpGet("[action]/{IdDoc}")]
        public async Task<IActionResult> GetLezioniByDocente([FromRoute] int IdDoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var materie = _context.Insegnare.Where(i => i.IdDocente == IdDoc);
            var lezioni = _context.Lezioni.Where(l => materie.Any(t => t.IdMateria == l.IdMateria && (l.Data.Date < DateTime.Now.Date || (l.Data.Date == DateTime.Now.Date && l.OraFine < DateTime.Now.TimeOfDay)))); //(l.Data < DateTime.Now || (l.Data == DateTime.Now && l.OraFine < DateTime.Now.TimeOfDay))

            return Ok(lezioni);
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