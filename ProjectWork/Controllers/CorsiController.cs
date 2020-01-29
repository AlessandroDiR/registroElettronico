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

        // GET: api/Corsis
        [HttpGet]
        public IEnumerable<Corsi> GetCorsi()
        {
            return _context.Corsi;
        }

        // GET: api/Corsis/5
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

        // PUT: api/Corsis/5
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

        // POST: api/Corsis
        [HttpPost]
        public async Task<IActionResult> PostCorsi([FromBody] Corsi corsi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Corsi.Add(corsi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCorsi", new { id = corsi.IdCorso }, corsi);
        }

        // DELETE: api/Corsis/5
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