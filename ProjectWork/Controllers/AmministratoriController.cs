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
        public async Task<IActionResult> PutAmministratori([FromRoute] string id, [FromBody] Amministratori amministratori)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != amministratori.IdAdmin)
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

        // POST: api/Amministratori/LoginAdmin
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginAdmin([FromBody] string username, string password)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = await _context.Amministratori.SingleOrDefaultAsync(d => d.Cf == username && d.Password == password);
            var corsoAmministrato = await _context.Amministrare.SingleOrDefaultAsync(c => c.IdAdmin == admin.IdAdmin);

            if (admin == null)
            {
                return NotFound("error");
            }

            var json = new
            {
                idCorso = corsoAmministrato.IdCorso,
                nome = admin.Nome,
                cognome = admin.Cognome
            };

            return Ok(json);
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
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAmministratori", new { id = amministratori.IdAdmin }, amministratori);
        }

        // POST: api/Amministratori/LoginAmministratore
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginAmministratore([FromBody] Amministratori amministratori)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var amministratore =  _context.Amministratori.Where(a => a.IdAdmin == amministratori.IdAdmin);

            if (amministratore == null)
            {
                return CreatedAtAction("GetAmministratori", false);
            }else
            {
                foreach (var item in amministratore)
                {
                    if (item.Password == amministratori.Password)
                    {
                        return CreatedAtAction("GetAmministratori", true);
                    }
                }
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAmministratori", false);
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

        private bool AmministratoriExists(string id)
        {
            return _context.Amministratori.Any(e => e.IdAdmin == id);
        }
    }
}