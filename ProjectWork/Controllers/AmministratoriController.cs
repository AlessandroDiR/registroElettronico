using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AmministratoriController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public AmministratoriController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Amministratori
        [HttpGet]
        public IEnumerable<Amministratori> GetAmministratori()
        {
            return _context.Amministratori;
        }

        // GET: api/Amministratori/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAmministratori([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var amministratori = await _context.Amministratori.FindAsync(id);

            if (amministratori == null)
            {
                return NotFound();
            }

            return Ok(amministratori);
        }

        // PUT: api/Amministratori/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAmministratori([FromRoute] int id, [FromBody] Amministratori amministratori)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != amministratori.IdAmministratore)
            {
                return BadRequest();
            }

            _context.Entry(amministratori).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AmministratoriExists(id))
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

        // POST: api/Amministratori/LoginAmministratori
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginAmministratori([FromBody] Amministratori amministratore)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = _context.Amministratori.Where(a => a.Username == amministratore.Username);

            if (admin == null)
            {
                return CreatedAtAction("GetDocenti", false);
            }
            else
            {
                foreach (var item in admin)
                {
                    if (item.Password == amministratore.Password)
                    {
                        return CreatedAtAction("GetAmministratori", true);
                    }
                }
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAmministratori", false);
        }

        // POST: api/Amministratori
        [HttpPost]
        public async Task<IActionResult> PostAmministratori([FromBody] Amministratori amministratori)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Amministratori.Add(amministratori);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AmministratoriExists(amministratori.IdAmministratore))
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAmministratori", new { id = amministratori.IdAmministratore }, amministratori);
        }

        // DELETE: api/Amministratori/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAmministratori([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var amministratori = await _context.Amministratori.FindAsync(id);
            if (amministratori == null)
            {
                return NotFound();
            }

            _context.Amministratori.Remove(amministratori);
            await _context.SaveChangesAsync();

            return Ok(amministratori);
        }

        private bool AmministratoriExists(int id)
        {
            return _context.Amministratori.Any(e => e.IdAmministratore == id);
        }
    }
}