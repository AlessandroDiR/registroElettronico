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
    public class PresenzeDocenteController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public PresenzeDocenteController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/PresenzeDocente
        [HttpGet]
        public IEnumerable<PresenzeDocente> GetPresenzeDocente()
        {
            return _context.PresenzeDocente;
        }

        // PUT: api/PresenzeDocente/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPresenzeDocente([FromRoute] int id, [FromBody] PresenzeDocente presenzeDocente)
        {
            LogPresenze log = new LogPresenze();
            log.DataOra = DateTime.Now;
            log.IdPresenza = id;
            log.IdDocente = presenzeDocente.IdDocente;
            var lezione = _context.Lezioni.First(l => l.IdLezione == presenzeDocente.IdLezione);
            log.IdCorso = lezione.IdCorso;
            var presenzaNonModificata = _context.PresenzeDocente.First(p => p.IdPresenza == id);
            log.Modifiche = "MODIFICHE = ";

            if (presenzeDocente.Ingresso != presenzaNonModificata.Ingresso)
            {
                log.Modifiche += string.Format("Valore precedente ingresso : {0} - Valore attuale ingresso : {1}; ", presenzaNonModificata.Ingresso, presenzeDocente.Ingresso);
            }

            if (presenzeDocente.Uscita != presenzaNonModificata.Uscita)
            {
                log.Modifiche += string.Format("Valore precedente uscita : {0} - Valore attuale uscita : {1}; ", presenzaNonModificata.Uscita, presenzeDocente.Uscita);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != presenzeDocente.IdPresenza)
            {
                return BadRequest();
            }
            _context.LogPresenze.Add(log);
            _context.Remove(presenzaNonModificata);
            _context.Entry(presenzeDocente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PresenzeDocenteExists(id))
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

        private bool PresenzeDocenteExists(int id)
        {
            return _context.PresenzeDocente.Any(e => e.IdPresenza == id);
        }
    }
}