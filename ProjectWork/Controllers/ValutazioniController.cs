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
    public class ValutazioniController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public ValutazioniController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Valutazioni
        [HttpGet]
        public IEnumerable<Valutazioni> GetValutazioni()
        {
            return _context.Valutazioni;
        }

        // GET: api/Valutazioni/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValutazioni([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var valutazioni = await _context.Valutazioni.FindAsync(id);

            if (valutazioni == null)
            {
                return NotFound();
            }

            return Ok(valutazioni);
        }

        // GET: api/Valutazioni/GetValutazioniStudenteByDocente/5/3
        [HttpGet("[action]/{idDocente}/{idStudente}")]
        public async Task<IActionResult> GetValutazioniStudenteByDocente([FromRoute] int idDocente, int idStudente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var valutazioni = _context.Valutazioni.Where(v => v.IdDocente == idDocente && v.IdStudente == idStudente);

            if (valutazioni == null)
            {
                return NotFound();
            }

            return Ok(valutazioni);
        }

        // PUT: api/Valutazioni/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutValutazioni([FromRoute] int id, [FromBody] Valutazioni valutazioni)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != valutazioni.IdValutazione)
            {
                return BadRequest();
            }

            _context.Entry(valutazioni).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ValutazioniExists(id))
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

        // POST: api/Valutazioni
        [HttpPost]
        public async Task<IActionResult> PostValutazioni([FromBody] Valutazioni valutazioni)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            _context.Valutazioni.Add(valutazioni);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetValutazioni", new { id = valutazioni.IdValutazione }, valutazioni);
        }


        // DELETE: api/Valutazioni/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteValutazioni([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var valutazioni = await _context.Valutazioni.FindAsync(id);
            if (valutazioni == null)
            {
                return NotFound();
            }

            _context.Valutazioni.Remove(valutazioni);
            await _context.SaveChangesAsync();

            return Ok(valutazioni);
        }

        private bool ValutazioniExists(int id)
        {
            return _context.Valutazioni.Any(e => e.IdValutazione == id);
        }
    }
}