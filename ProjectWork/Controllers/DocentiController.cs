using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;
using BCrypt;

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

        // GET: api/Docenti/GetDocentiById/5
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetDocentiById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var docente = await _context.Docenti.FindAsync(id);

            if (docente == null)
            {
                return NotFound();
            }

            var getCorsi = _context.Tenere.Where(c => c.IdDocente == id);
            var idCorsi = new List<int>();
            foreach(var corso in getCorsi)
            {
                idCorsi.Add(corso.IdCorso);
            }

            var materie = _context.Insegnare.Where(i => i.IdDocente == id);
            var idMaterie = new List<int>();
            foreach (var m in materie)
            {
                idMaterie.Add(m.IdMateria);
            }

            var result = new
            {
                nome = docente.Nome,
                cognome = docente.Cognome,
                email = docente.Email,
                dataNascita = docente.DataNascita,
                luogoNascita = docente.LuogoNascita,
                cf = docente.Cf,
                corsi = idCorsi,
                materie = idMaterie
            };


            return Ok(result);
        }

        // GET: api/Docenti/GetDocentiByCorso/5
        [HttpGet("[action]/{idc}")]
        public async Task<IActionResult> GetDocentiByCorso([FromRoute] int idc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tenere = _context.Tenere.Where(t => t.IdCorso == idc);

            var docenti = _context.Docenti.Where(d => tenere.Any(t => t.IdDocente == d.IdDocente));

            if (docenti == null)
            {
                return NotFound();
            }

            return Ok(docenti);
        }

        // GET: api/Docenti/GetDocentiByCf/cf
        [HttpGet("[action]/{Cf}")]
        public async Task<IActionResult> GetDocentiByCf([FromRoute] string cf)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var docenti = await _context.Docenti.FirstOrDefaultAsync(d => d.Cf == cf);

            if (docenti == null)
            {
                return NotFound();
            }

            return Ok(docenti);
        }

        //[HttpGet("[action]/{idDocente}")]
        //public async Task<IActionResult> GetLezioniDocente([FromRoute] int idDocente)
        //{
        //    var materie = _context.Insegnare.Where(i => i.IdDocente == idDocente);
        //    var lezioni = new List<object>();
        //    foreach(var m in materie)
        //    {
        //        lezioni.Add(_context.Lezioni.Where(l => l.IdMateria == m.IdMateria && l.Data < DateTime.Now));
        //    }

        //    return Ok(lezioni);
        //}

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

            if (docenti == null)
            {
                return NotFound();
            }


            var t = _context.Tenere.Where(d => d.IdDocente == id);
            _context.Tenere.RemoveRange(t);
            
            _context.Tenere.AddRange(docenti.Tenere);

            var i = _context.Insegnare.Where(d => d.IdDocente == id);
            _context.Insegnare.RemoveRange(i);

            _context.Insegnare.AddRange(docenti.Insegnare);

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

        //Crea docente
        // POST: api/Docenti
        [HttpPost]
        public async Task<IActionResult> PostDocenti([FromBody] Docenti d)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Docenti docente = new Docenti();
            docente.Nome = d.Nome;
            docente.Cognome = d.Cognome;
            docente.Cf = d.Cf;
            docente.DataNascita = d.DataNascita;
            docente.LuogoNascita = d.LuogoNascita;
            docente.Password = BCrypt.Net.BCrypt.HashPassword(d.Cf);
            docente.Email = d.Email;

            var doc = _context.Docenti.Last();
            if (doc == null)
            {
                return CreatedAtAction("GetDocenti", "Docente inesistente");
            }
            foreach (var item in d.Tenere)
            {
                item.IdDocente = doc.IdDocente;
            }
            _context.Tenere.AddRange(d.Tenere);
            foreach (var item in d.Insegnare)
            {
                item.IdDocente = doc.IdDocente;
            }
            _context.Insegnare.AddRange(d.Insegnare);
            _context.Docenti.Add(docente);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDocenti", new { id = docente.IdDocente }, docente);
        }

        // POST: api/Docenti/LoginDocente
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginDocente([FromBody] Docenti docenti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var docente = _context.Docenti.Where(d => d.Cf == docenti.Cf);

            if (docente == null)
            {
                return CreatedAtAction("GetDocenti", false);
            }
            else
            {
                foreach (var item in docente)
                {
                    if (item.Password == docenti.Password)
                    {
                        return CreatedAtAction("GetDocenti", true);
                    }
                }
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDocenti", false);
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

            docenti.Ritirato = "True";

            //var t = _context.Tenere.Where(d => d.IdDocente == id);
            //_context.Tenere.RemoveRange(t);
            //var i = _context.Insegnare.Where(d => d.IdDocente == id);
            //_context.Insegnare.RemoveRange(i);
            //_context.Docenti.Remove(docenti);
            _context.Entry(docenti).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(docenti);
        }

        private bool DocentiExists(int id)
        {
            return _context.Docenti.Any(e => e.IdDocente == id);
        }
    }
}