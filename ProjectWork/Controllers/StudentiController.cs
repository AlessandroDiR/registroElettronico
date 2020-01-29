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
    public class StudentiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public StudentiController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Studenti
        [HttpGet]
        public IEnumerable<Studenti> GetStudenti()
        {
            return _context.Studenti;
        }

        // GET: api/Studenti/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudenti([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studenti = await _context.Studenti.FindAsync(id);

            if (studenti == null)
            {
                return NotFound();
            }

            return Ok(studenti);
        }

        // PUT: api/Studenti/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudenti([FromRoute] int id, [FromBody] Studenti studenti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != studenti.IdStudente)
            {
                return BadRequest();
            }

            _context.Entry(studenti).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentiExists(id))
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

        // POST: api/Studenti
        [HttpPost]
        public async Task<IActionResult> PostStudenti([FromBody] Studenti studente )
        {
            //string nome, string luogo_nas, string cognome, string cf, DateTime data_nas, int anno_iscrizione, int id_corso
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            /*
            Studenti studente = new Studenti();
            studente.Nome = nome;
            studente.Cognome = cognome;
            studente.Cf = cf;
            studente.DataNascita = data_nas;
            studente.AnnoIscrizione = anno_iscrizione;
            studente.LuogoNascita = luogo_nas;
            studente.IdCorso = id_corso;
            studente.Password = cf;
            */
            _context.Studenti.Add(studente);
            
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudenti", new { id = studente.IdStudente }, studente);
        }

        // DELETE: api/Studenti/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudenti([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studenti = await _context.Studenti.FindAsync(id);
            if (studenti == null)
            {
                return NotFound();
            }

            _context.Studenti.Remove(studenti);
            await _context.SaveChangesAsync();

            return Ok(studenti);
        }

        private bool StudentiExists(int id)
        {
            return _context.Studenti.Any(e => e.IdStudente == id);
        }
    }
}