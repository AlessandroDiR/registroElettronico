using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;
using ProjectWork.classi;

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
        public async Task<IActionResult> PostCalendari([FromBody] Calendari calendario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!CalendariExists(calendario.IdCalendario))
            {
                calendario.IdCalendario = Guid.NewGuid().ToString();
                _context.Calendari.Add(calendario);
            }
            else
            {
                if (!GoogleCalendarExists(calendario))
                {
                    _context.Lezioni.RemoveRange(_context.Lezioni.Where(l => l.IdCalendario == calendario.IdCalendario));
                    var events = _calendarApi.GetCalendarEvents(calendario);
                    _calendarApi.SaveEventsInContext(calendario, events);
                }
                else
                {
                    var updatedCalendar = _context.Calendari.Find(calendario.IdCalendario);
                    var updatedEvents = _calendarApi.GetUpdatedEvents(updatedCalendar);
                    _calendarApi.UpdateEventsInContext(calendario, updatedEvents);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CalendariExists(calendario.IdCalendario))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return Ok("ok");
        }

        // DELETE: api/Calendari/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCalendari([FromRoute] string id)
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

            _context.Calendari.Remove(calendario);
            await _context.SaveChangesAsync();

            return Ok(calendario);
        }

        private bool CalendariExists(string id)
        {
            return _context.Calendari.Any(e => e.IdCalendario == id);
        }

        private bool GoogleCalendarExists(Calendari c)
        {
            return _context.Calendari.Any(gc => gc.IdCalendario == c.IdCalendario && gc.IdGoogleCalendar == c.IdGoogleCalendar);
        }
    }
}