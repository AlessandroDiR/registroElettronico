using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.CustomizedModels;
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
        public async Task<IActionResult> PutPresenzeDocente([FromRoute] int id, [FromBody] PutPresenzeDocenteModel obj)
        {
            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            LogPresenze log = new LogPresenze
            {
                DataOra = DateTime.Now,
                IdPresenza = id,
                IdDocente = obj.Presenza.IdDocente
            };

            var lezione = _context.Lezioni.First(l => l.IdLezione == obj.Presenza.IdLezione);
            lezione.IdCalendarioNavigation = _context.Calendari.SingleOrDefault(c => c.IdCalendario == lezione.IdCalendario);

            log.IdCorso = lezione.IdCalendarioNavigation.IdCorso;
            var presenzaNonModificata = _context.PresenzeDocente.First(p => p.IdPresenza == id);
            log.Modifiche = "MODIFICHE = ";
            bool modificato = false;

            if (obj.Presenza.Ingresso != presenzaNonModificata.Ingresso)
            {
                log.Modifiche += string.Format("Valore precedente ingresso : {0} - Valore attuale ingresso : {1}; ", presenzaNonModificata.Ingresso, obj.Presenza.Ingresso);
                modificato = true;
            }

            if (obj.Presenza.Uscita != presenzaNonModificata.Uscita)
            {
                log.Modifiche += string.Format("Valore precedente uscita : {0} - Valore attuale uscita : {1}; ", presenzaNonModificata.Uscita, obj.Presenza.Uscita);
                modificato = true;
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != obj.Presenza.IdPresenza)
            {
                return BadRequest();
            }

            if (modificato==true)
            {
                _context.LogPresenze.Add(log);
                _context.Remove(presenzaNonModificata);
                _context.Entry(obj.Presenza).State = EntityState.Modified;
            }
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