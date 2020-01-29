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
    public class DocentiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public DocentiController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Docenti
        [HttpGet]
        public IEnumerable<Docenti> GetDocenti()
        {
            return _context.Docenti;
        }

        // GET: api/Docenti/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocenti([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var docenti = await _context.Docenti.FindAsync(id);

            if (docenti == null)
            {
                return NotFound();
            }

            return Ok(docenti);
        }

        // PUT: api/Docenti/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocenti([FromRoute] int id, [FromBody] Docenti docenti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != docenti.IdDocente)
            {
                return BadRequest();
            }

            _context.Entry(docenti).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocentiExists(id))
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

        // POST: api/Docenti
        [HttpPost]
        public async Task<IActionResult> PostDocenti([FromBody] Docenti docenti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Docenti.Add(docenti);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDocenti", new { id = docenti.IdDocente }, docenti);
        }

        // DELETE: api/Docenti/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocenti([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var docenti = await _context.Docenti.FindAsync(id);
            if (docenti == null)
            {
                return NotFound();
            }

            _context.Docenti.Remove(docenti);
            await _context.SaveChangesAsync();

            return Ok(docenti);
        }

        private bool DocentiExists(int id)
        {
            return _context.Docenti.Any(e => e.IdDocente == id);
        }
    }
}