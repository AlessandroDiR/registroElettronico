using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;
using ProjectWork.classi;
using Google.Apis.Calendar.v3.Data;
using ProjectWork.CustomizedModels;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendariController : ControllerBase
    {
        private readonly AvocadoDBContext _context;
        private readonly CalendarApi _calendarApi;

        public CalendariController(AvocadoDBContext context)
        {
            _context = context;
            _calendarApi = new CalendarApi(context);
        }

        // GET: api/Calendari
        [HttpGet]
        public IEnumerable<Calendari> GetCalendari()
        {
            return _context.Calendari;
        }

        // GET: api/Calendari/idCorso/anno
        [HttpGet("{idCorso}/{anno}")]
        public async Task<IActionResult> GetCalendari([FromRoute] int idCorso, int anno)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(await _context.Calendari.SingleOrDefaultAsync(c => c.IdCorso == idCorso && c.Anno == anno));
        }

        // GET: api/Calendari/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCalendari([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var calendario = await _context.Calendari.FindAsync(id);

            if (calendario == null)
            {
                return NotFound();
            }

            return Ok(calendario);
        }

        // POST: api/Calendari
        [HttpPost]
        public async Task<IActionResult> PostCalendari([FromBody] PostCalendarioModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            var lezioniNonValidate = new List<EventiModel>();

            if (!CalendariExists(obj.Calendario.IdCalendario))
            {
                _context.Calendari.Remove(_context.Calendari.SingleOrDefault(c => c.IdCorso == obj.Calendario.IdCorso && c.Anno == obj.Calendario.Anno));
                _context.Calendari.Add(obj.Calendario);
                var events = _calendarApi.GetCalendarEvents(obj.Calendario);
                lezioniNonValidate = _calendarApi.SaveEventsInContext(obj.Calendario, events);
            }
            else
            {
                _context.Calendari.Update(obj.Calendario);
                var updatedEvents = _calendarApi.GetUpdatedEvents(obj.Calendario);
                lezioniNonValidate = _calendarApi.UpdateEventsInContext(obj.Calendario, updatedEvents);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CalendariExists(obj.Calendario.IdCalendario))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return Ok(lezioniNonValidate);
        }

        private bool CalendariExists(string id)
        {
            return _context.Calendari.Any(e => e.IdCalendario == id);
        }
    }
}