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

        // GET: api/Studenti/GetStudentiById/5
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetStudentiById([FromRoute] int id)
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

        // GET: api/Studenti/GetStudentiByCf/5
        [HttpGet("[action]/{Cf}")]
        public async Task<IActionResult> GetStudentiByCf([FromRoute] string cf)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studenti = await _context.Studenti.FirstOrDefaultAsync(s => s.Cf == cf);

            if (studenti == null)
            {
                return NotFound();
            }
            
            return Ok(studenti);
        }

        // GET: api/Studenti/firma/codice
        [HttpGet("[action]/{code}")]
        public string Firma([FromRoute] string code)
        {
            if (!CheckCode(Encoder.encode(code)))
            {
                return OutputMsg.generateMessage("Errore", "Il codice non è valido!", true);
            }

            // recupero lo studente, controllo se è ingresso o uscita e 
            // salvare la firma nel db con l'ora attuale. (LA TOLLERANZA VIENE CONSIDERATA DA PARTE DEL TUTOR)

            var studente = _context.Studenti.SingleOrDefault(s => s.Cf == code);
            return OutputMsg.generateMessage("Ok", $"Ciao {studente.Nome}!");
        }

        // GET: api/studenti/coderequest/2
        [HttpGet("[action]/{idStudente}")]
        public async Task<IActionResult> CodeRequest([FromRoute] int idStudente)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studente = await _context.Studenti.SingleOrDefaultAsync(s => s.IdStudente == idStudente);

            if (studente == null)
            {
                return NotFound();
            }

            return Ok(Encoder.encode(studente.Cf));
        }

        public bool CheckCode(string code)
        {
            var decoded = Encoder.decode(code);
            var studente = _context.Studenti.FirstOrDefault(s => s.Cf == decoded);

            return studente != null ? true : false;
        }

        //Crea studente
        // POST: api/Studenti
        [HttpPost]
        public async Task<IActionResult> PostStudenti([FromBody] Studenti s )
        {
            //string nome, string luogo_nas, string cognome, string cf, DateTime data_nas, int anno_iscrizione, int id_corso
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            Studenti studente = new Studenti();
            studente.Nome = s.Nome;
            studente.Cognome = s.Cognome;
            studente.Cf = s.Cf;
            studente.DataNascita = s.DataNascita;
            studente.AnnoIscrizione = s.AnnoIscrizione;
            studente.LuogoNascita = s.LuogoNascita;
            studente.IdCorso = s.IdCorso;
            studente.Password = s.Cf;
            
            _context.Studenti.Add(studente);
            
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudenti", new { id = studente.IdStudente }, studente);
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