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
    public class PresenzeController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public PresenzeController(AvocadoDBContext context)
        {
            _context = context;
        }

        // PUT: api/Presenze/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPresenze([FromRoute] int id, [FromBody] Presenze presenze)
        {
            LogPresenze log = new LogPresenze();
            log.DataOra = DateTime.Now;
            log.IdPresenza = id;
            log.IdStudente = presenze.IdStudente;
            var lezione = _context.Lezioni.First(l => l.IdLezione == presenze.IdLezione);
            lezione.IdCalendarioNavigation = _context.Calendari.SingleOrDefault(c => c.IdCalendario == lezione.IdCalendario);
            log.IdCorso = lezione.IdCalendarioNavigation.IdCorso;
            var presenzaNonModificata = _context.Presenze.First(p => p.IdPresenza == id);
            log.Modifiche = "MODIFICHE = ";
            bool modificato = false;

            if (presenze.Ingresso != presenzaNonModificata.Ingresso)
            {
                log.Modifiche += string.Format("Valore precedente ingresso : {0} - Valore attuale ingresso : {1}; ", presenzaNonModificata.Ingresso, presenze.Ingresso);
                modificato = true;
            }

            if (presenze.Uscita != presenzaNonModificata.Uscita)
            {
                log.Modifiche += string.Format("Valore precedente uscita : {0} - Valore attuale uscita : {1}; ", presenzaNonModificata.Uscita, presenze.Uscita);
                modificato = true;
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != presenze.IdPresenza)
            {
                return BadRequest();
            }

            if (modificato == true)
            {
                _context.LogPresenze.Add(log);
                _context.Remove(presenzaNonModificata);
                _context.Entry(presenze).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PresenzeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("success");
        }

        // DELETE: api/Presenze/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePresenze([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var presenze = await _context.Presenze.FindAsync(id);
            if (presenze == null)
            {
                return NotFound();
            }

            _context.Presenze.Remove(presenze);
            await _context.SaveChangesAsync();

            return Ok(presenze);
        }

        private bool PresenzeExists(int id)
        {
            return _context.Presenze.Any(e => e.IdPresenza == id);
        }
    }
}