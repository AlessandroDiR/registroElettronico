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
    public class CorsiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public CorsiController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Corsi
        [HttpGet]
        public IEnumerable<Corsi> GetCorsi()
        {
            return _context.Corsi;
        }

        // GET: api/Corsi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCorsi([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var corsi = await _context.Corsi.FindAsync(id);

            if (corsi == null)
            {
                return NotFound();
            }
            
            return Ok(corsi);
        }

        // GET: api/Corsi/GetCorsiByDocenti/IdDoc
        [HttpGet("[action]/{IdDoc}")]
        public async Task<IActionResult> GetCorsiByDocenti([FromRoute] int IdDoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var tenere = _context.Tenere.Where(d => d.IdDocente == IdDoc);

            var corso = _context.Corsi.Where(c => tenere.Any(t => t.IdCorso == c.IdCorso));

            return Ok(corso);
        }

        // PUT: api/Corsi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCorsi([FromRoute] int id, [FromBody] Corsi corsi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != corsi.IdCorso)
            {
                return BadRequest();
            }

            var t = _context.Tenere.Where(c => c.IdCorso == id);
            _context.Tenere.RemoveRange(t);

            _context.Tenere.AddRange(corsi.Tenere);
            var com = _context.Comprende.Where(c => c.IdCorso == id);
            _context.Comprende.RemoveRange(com);

            _context.Comprende.AddRange(corsi.Comprende);

            _context.Entry(corsi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CorsiExists(id))
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

        // POST: api/Corsi
        [HttpPost]
        public async Task<IActionResult> PostCorsi([FromBody] Corsi corsi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cor = _context.Corsi.Last();
            if (cor == null)
            {
                return CreatedAtAction("GetCorsi", "Corso inesistente");
            }
            foreach (var item in corsi.Tenere)
            {
                item.IdCorso = corsi.IdCorso;
            }
            _context.Tenere.AddRange(corsi.Tenere);
            foreach (var item in corsi.Comprende)
            {
                item.IdCorso = cor.IdCorso;
            }
            _context.Comprende.AddRange(corsi.Comprende);

            _context.Corsi.Add(corsi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCorsi", new { id = corsi.IdCorso }, corsi);
        }

        // DELETE: api/Corsi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCorsi([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var corsi = await _context.Corsi.FindAsync(id);
            if (corsi == null)
            {
                return NotFound();
            }
            var t = _context.Tenere.Where(c => c.IdCorso == id);
            _context.Tenere.RemoveRange(t);
            var com = _context.Comprende.Where(c => c.IdCorso == id);
            _context.Comprende.RemoveRange(com);
            _context.Corsi.Remove(corsi);
            await _context.SaveChangesAsync();

            return Ok(corsi);
        }

        private bool CorsiExists(int id)
        {
            return _context.Corsi.Any(e => e.IdCorso == id);
        }
    }
}