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

        // PUT: api/Calendari/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCalendari([FromRoute] string id, [FromBody] Calendari calendario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != calendario.IdCalendario)
            {
                return BadRequest();
            }

            _context.Entry(calendario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CalendariExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Calendari
        [HttpPost]
        public async Task<IActionResult> PostCalendari([FromBody] Calendari calendario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            calendario.IdCalendario = Guid.NewGuid().ToString();
            _context.Calendari.Add(calendario);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CalendariExists(calendario.IdCalendario))
                {
                    _context.Calendari.Update(calendario);

                    return Ok(calendario);
                }
                else
                {
                    throw;
                }
            }

            _calendarApi.SaveEventsInContext(calendario.IdGoogleCalendar, calendario.IdCalendario);

            return CreatedAtAction("GetCalendari", new { id = calendario.IdCalendario }, calendario);
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
    }
}