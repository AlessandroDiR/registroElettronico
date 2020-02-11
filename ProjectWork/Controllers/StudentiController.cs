using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Cors;

namespace ProjectWork.Controllers
{
    [EnableCors("AllowAllHeaders")]
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
            // salvo la firma nel db con l'ora attuale. (LA TOLLERANZA VIENE CONSIDERATA DA PARTE DEL TUTOR)

            var studente = _context.Studenti.SingleOrDefault(s => s.Cf == code);

            return SalvaFirma(studente);
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

        [HttpGet("[action]/{idStudente}")]
        public async Task<IActionResult> GetHoursAmount([FromRoute] int idStudente)
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

            var presenzeTotali = _context.Presenze.Where(p => p.IdStudente == idStudente);
            TimeSpan? hoursAmount = new TimeSpan();

            foreach (var p in presenzeTotali)
            {
                var dailyHours = p.Uscita - p.Ingresso;
                if (dailyHours != null)
                {
                    hoursAmount += dailyHours;
                }
            }

            return Ok(hoursAmount);
        }

        [HttpGet("[action]/{idStudente}")]
        public async Task<IActionResult> GetDaysAmount([FromRoute] int idStudente)
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

            var getPresenze = _context.Presenze.Where(p => p.IdStudente == idStudente);
            foreach (var day in getPresenze)
            {
                if (day.IdLezioneNavigation == null)
                    day.IdLezioneNavigation = _context.Lezioni.FirstOrDefault(l => l.IdLezione == day.IdLezione);
            }

            var daysAmount = getPresenze.GroupBy(p => p.IdLezioneNavigation.Data);

            return Ok(daysAmount.Count());
        }

        [HttpGet("[action]/{idStudente}")]
        public async Task<IActionResult> GetDetailedPresences([FromRoute] int idStudente)
        {
            var presences = _context.Presenze.Where(p => p.IdStudente == idStudente);

            if(presences == null)
            {
                return RedirectToAction("GetStudenti");
            }

            var result = new List<object>();
            foreach(var p in presences)
            {
                if (p.IdLezioneNavigation == null)
                    p.IdLezioneNavigation = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezione);

                var json = new
                {
                    idPresenza = p.IdPresenza,
                    idStudente = p.IdStudente,
                    data = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezioneNavigation.IdLezione).Data,
                    lezione = _context.Materie.FirstOrDefault(m => m.IdMateria == p.IdLezioneNavigation.IdMateria).Nome,
                    ingresso = p.Ingresso,
                    uscita = p.Uscita
                };

                result.Add(json);
            }
            return Ok(result);
        }

        //Crea studente
        // POST: api/Studenti
        [HttpPost]
        public async Task<IActionResult> PostStudenti([FromBody] Studenti[] studenti)
        {
            //string nome, string luogo_nas, string cognome, string cf, DateTime data_nas, int anno_iscrizione, int id_corso
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            foreach(var s in studenti)
            {
                Studenti studente = new Studenti();
                studente.Nome = s.Nome;
                studente.Cognome = s.Cognome;
                studente.Cf = s.Cf;
                studente.Email = s.Email;
                studente.DataNascita = s.DataNascita;
                studente.AnnoIscrizione = s.AnnoIscrizione;
                studente.LuogoNascita = s.LuogoNascita;
                studente.IdCorso = s.IdCorso;
                studente.Password = s.Cf;

                _context.Studenti.Add(studente);
            }

            

            await _context.SaveChangesAsync();

            return RedirectToAction("GetStudenti");
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

            return Ok(studenti);
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

        private bool CheckCode(string code)
        {
            var decoded = Encoder.decode(code);
            var studente = _context.Studenti.FirstOrDefault(s => s.Cf == decoded);

            return studente != null ? true : false;
        }

        private string SalvaFirma(Studenti s)
        {
            var date = DateTime.Now;
            var time = TimeSpan.Parse(date.TimeOfDay.ToString().Split('.')[0]);

            var lesson = _context.Lezioni.Where(l => l.Data == date);

            if (lesson != null)
            {
                foreach (var l in lesson)
                {
                    var presenza = _context.Presenze.SingleOrDefault(p => p.IdLezione == l.IdLezione && p.IdStudente == s.IdStudente);
                    if (l.OraFine < time)
                    {
                        if (presenza != null && presenza.Ingresso != null && presenza.Uscita == null)
                        {
                            presenza.Uscita = time;
                            _context.SaveChanges();
                            return OutputMsg.generateMessage("Ok",$"Arrivederci {s.Nome}!");
                        }
                    }
                    else if (presenza != null && presenza.Ingresso != null && presenza.Uscita == null)
                    {
                        presenza.Uscita = time;
                        _context.SaveChanges();
                        return OutputMsg.generateMessage("Ok", $"Arrivederci {s.Nome}!");
                    }
                    else if (presenza == null && l.OraInizio <= time && l.OraFine >= time)
                    {
                        var newPresenza = new Presenze
                        {
                            IdLezione = l.IdLezione,
                            IdStudente = s.IdStudente,
                            Ingresso = time
                        };
  
                        _context.Presenze.Add(newPresenza);
                        _context.SaveChanges();
                        return OutputMsg.generateMessage("Ok", $"Ben arrivato {s.Nome}!");
                    }
                }
            }

            return OutputMsg.generateMessage("Ops", "Non ci sono lezioni oggi!", true);
        }
    }
}