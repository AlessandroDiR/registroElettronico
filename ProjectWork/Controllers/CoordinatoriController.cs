using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatoriController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public CoordinatoriController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Coordinatori
        [HttpGet]
        public IEnumerable<Coordinatori> GetCoordinatori()
        {
            return _context.Coordinatori;
        }

        // GET: api/Coordinatori/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCoordinatori([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatori = await _context.Coordinatori.FindAsync(id);

            if (coordinatori == null)
            {
                return NotFound();
            }

            return Ok(coordinatori);
        }

        // PUT: api/Coordinatori/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCoordinatore([FromRoute] string id, [FromBody] Coordinatori c)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != c.IdCoordinatore)
            {
                return BadRequest();
            }

            _context.Entry(c).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CoordinatoriExists(id))
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

        // POST: api/Coordinatori/LoginCoordinatore
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginCoordinatore([FromBody] CredenzialiModel cred)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coord = await _context.Coordinatori.SingleOrDefaultAsync(d => d.Cf == cred.username && d.Password == cred.password);
            
            if (coord == null)
            {
                return Ok("error");
            }

            var corsoAmministrato = await _context.Coordina.SingleOrDefaultAsync(c => c.IdCoordinatore == coord.IdCoordinatore);
            var json = new
            {
                idCorso = corsoAmministrato.IdCorso,
                nome = coord.Nome,
                cognome = coord.Cognome
            };

            return Ok(json);
        }

        // POST: api/Coordinatori
        [HttpPost]
        public async Task<IActionResult> PostCoordinatore([FromBody] Coordinatori c)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Coordinatori.Add(c);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCoordinatori", new { id = c.IdCoordinatore }, c);
        }

        // DELETE: api/Coordinatori/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoordinatori([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var c = await _context.Coordinatori.FindAsync(id);
            if (c == null)
            {
                return NotFound();
            }

            _context.Coordinatori.Remove(c);
            await _context.SaveChangesAsync();

            return Ok(c);
        }

        private bool CoordinatoriExists(string id)
        {
            return _context.Coordinatori.Any(e => e.IdCoordinatore == id);
        }
    }
}