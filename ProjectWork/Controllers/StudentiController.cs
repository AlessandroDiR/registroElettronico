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
using ProjectWork.classi;

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
        public IActionResult GetStudenti()
        {

            var studenti = _context.Studenti;
            var result = new List<object>();

            foreach (var s in studenti)
            {
                var json = new
                {
                    idStudente = s.IdStudente,
                    idCorso = s.IdCorso,
                    nome = s.Nome,
                    cognome = s.Cognome,
                    email = s.Email,
                    dataNascita = s.DataNascita,
                    cf = s.Cf,
                    ritirato = bool.Parse(s.Ritirato),
                    dataRitiro = s.DataRitiro,
                    promosso = bool.Parse(s.Promosso),
                    annoFrequentazione = s.AnnoFrequentazione,
                    giornate = GetDaysAmount(s.IdStudente),
                    frequenza = GetPercentualeFrequenza(s.IdStudente)
                };

                result.Add(json);
            }
            return Ok(result);
        }

        // GET: api/Studenti/1
        [HttpGet("{idCorso}")]
        public IActionResult GetStudenti([FromRoute] int idCorso)
        {
            var studenti = _context.Studenti.Where(s => s.IdCorso == idCorso);
            var result = new List<object>();

            foreach(var s in studenti)
            {
                var json = new
                {
                    idStudente = s.IdStudente,
                    idCorso = s.IdCorso,
                    nome = s.Nome,
                    cognome = s.Cognome,
                    email = s.Email,
                    dataNascita = s.DataNascita,
                    cf = s.Cf,
                    ritirato = bool.Parse(s.Ritirato),
                    dataRitiro = s.DataRitiro,
                    promosso = bool.Parse(s.Promosso),
                    annoFrequentazione = s.AnnoFrequentazione,
                    giornate = GetDaysAmount(s.IdStudente),
                    frequenza = GetPercentualeFrequenza(s.IdStudente)
                };

                result.Add(json);
            }
            return Ok(result);
        }

        // GET: api/Studenti/GetStudentiById/5
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetStudentiById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var s = await _context.Studenti.FindAsync(id);

            if (s == null)
            {
                return NotFound();
            }

            var json = new
            {
                idStudente = s.IdStudente,
                idCorso = s.IdCorso,
                nome = s.Nome,
                cognome = s.Cognome,
                email = s.Email,
                dataNascita = s.DataNascita,
                cf = s.Cf,
                codice = s.Codice,
                ritirato = bool.Parse(s.Ritirato),
                dataRitiro = s.DataRitiro,
                promosso = bool.Parse(s.Promosso),
                annoFrequentazione = s.AnnoFrequentazione,
                giornate = GetDaysAmount(s.IdStudente),
                frequenza = GetPercentualeFrequenza(s.IdStudente)
            };

            return Ok(json);
        }

        // GET: api/Studenti/GetStudentiByCf/5
        [HttpGet("[action]/{Cf}")]
        public async Task<IActionResult> GetStudentiByCf([FromRoute] string cf)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var studente = await _context.Studenti.FirstOrDefaultAsync(s => s.Cf == cf);

            if (studente == null)
            {
                return NotFound();
            }

            var json = new
            {
                idStudente = studente.IdStudente,
                idCorso = studente.IdCorso,
                nome = studente.Nome,
                cognome = studente.Cognome,
                email = studente.Email,
                dataNascita = studente.DataNascita,
                cf = studente.Cf,
                ritirato = bool.Parse(studente.Ritirato),
                dataRitiro = studente.DataRitiro,
                promosso = bool.Parse(studente.Promosso),
                annoFrequentazione = studente.AnnoFrequentazione,
                giornate = GetDaysAmount(studente.IdStudente),
                frequenza = GetPercentualeFrequenza(studente.IdStudente)
            };

            return Ok(json);
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

            var hoursAmount = HoursAmount(idStudente);

            return Ok(hoursAmount);
        }

        [HttpGet("[action]/{idStudente}")]
        public IActionResult GetDetailedPresences([FromRoute] int idStudente)
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
                    idLezione = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezioneNavigation.IdLezione).IdLezione,
                    lezione = _context.Lezioni.FirstOrDefault(l => l.IdLezione == p.IdLezioneNavigation.IdLezione).Titolo,
                    ingresso = p.Ingresso,
                    uscita = p.Uscita
                };

                result.Add(json);
            }
            return Ok(result);
        }

        [HttpGet("[action]/{idStudente}")]
        public double GetTotaleOreLezioni([FromRoute] int idStudente)
        {
            return TotaleOreLezioni(idStudente);
        }

        //Crea studente
        // POST: api/Studenti
        [HttpPost]
        public async Task<IActionResult> PostStudenti([FromBody] Studenti[] studenti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var idCorso = studenti[0].IdCorso;

            foreach(var s in studenti)
            {
                Studenti studente = new Studenti();
                studente.Nome = s.Nome;
                studente.Cognome = s.Cognome;
                studente.Cf = s.Cf;
                studente.Email = s.Email;
                studente.DataNascita = s.DataNascita;
                studente.AnnoFrequentazione = s.AnnoFrequentazione;
                studente.IdCorso = s.IdCorso;
                studente.Password = Cipher.encode(s.Cf);
                studente.Codice = Cipher.encode(s.Cf);

                _context.Studenti.Add(studente);
            }

            await _context.SaveChangesAsync();

            return GetStudenti(idCorso);
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

            var s = await _context.Studenti.SingleOrDefaultAsync(i => i.IdStudente == id);

            if (studenti.Password == null)
                studenti.Password = s.Password;

            if (studenti.Codice == null)
                studenti.Codice = s.Codice;

            _context.Remove(s);
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

            var json = new
            {
                idStudente = studenti.IdStudente,
                idCorso = studenti.IdCorso,
                nome = studenti.Nome,
                cognome = studenti.Cognome,
                email = studenti.Email,
                dataNascita = studenti.DataNascita,
                cf = studenti.Cf,
                ritirato = bool.Parse(studenti.Ritirato),
                dataRitiro = studenti.DataRitiro,
                promosso = bool.Parse(s.Promosso),
                annoFrequentazione = studenti.AnnoFrequentazione,
                giornate = GetDaysAmount(studenti.IdStudente),
                frequenza = GetPercentualeFrequenza(studenti.IdStudente)
            };

            return Ok(json);
        }

        // PUT: api/Studenti
        [HttpPut]
        public IActionResult PutStudentiArray([FromBody] Studenti[] studenti)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var idCorso = studenti[0].IdCorso;

            foreach (var item in studenti)
            {
                try
                {
                    var s = _context.Studenti.Find(item.IdStudente);

                    if (item.Password == null)
                        item.Password = s.Password;

                    if (item.Codice == null)
                        item.Codice = s.Codice;

                    _context.Remove(s);
                    _context.Entry(item).State = EntityState.Modified;
                }
                catch
                {
                    if (!StudentiExists(item.IdStudente))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            _context.SaveChanges();
            return GetStudenti(idCorso);
        }

        public class Promozione
        {
            public int idStudente { get; set; }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PromuoviStudente([FromBody] Promozione Studente)
        {
            var studente = _context.Studenti.FirstOrDefault(s => s.IdStudente == Studente.idStudente);

            if (studente == null)
            {
                return NotFound("Studente non esistente");      
            }
            else
            {
                studente.Promosso = "true";
            }

            _context.Entry(studente).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return GetStudenti(studente.IdCorso);
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
            studenti.Ritirato = "true";
            //_context.Studenti.Remove(studenti);
            _context.Entry(studenti).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(studenti);
        }

        private bool StudentiExists(int id)
        {
            return _context.Studenti.Any(e => e.IdStudente == id);
        }

        public int GetDaysAmount(int idStudente)
        {
            var studente = _context.Studenti.SingleOrDefault(s => s.IdStudente == idStudente);

            var getPresenze = _context.Presenze.Where(p => p.IdStudente == idStudente);
            foreach (var day in getPresenze)
            {
                if (day.IdLezioneNavigation == null)
                    day.IdLezioneNavigation = _context.Lezioni.FirstOrDefault(l => l.IdLezione == day.IdLezione);
            }

            var daysAmount = getPresenze.GroupBy(p => p.IdLezioneNavigation.Data);

            return daysAmount.Count();
        }

        public double GetPercentualeFrequenza(int idStudente)
        {
            // la percentuale viene calcolata in relazione alle ore di lezione svolte ed alle ore di presenza effettive dello studente
            var totOreLezioni = TotaleOreLezioni(idStudente);

            var oreEffettiveStudente = HoursAmount(idStudente);

            var percentualePresenza = oreEffettiveStudente * 100 / totOreLezioni;

            return Math.Round(percentualePresenza, 0);
        }

        public double HoursAmount(int idStudente)
        {
            var presenzeTotali = _context.Presenze.Where(p => p.IdStudente == idStudente && p.Uscita != new TimeSpan(0,0,0));
            TimeSpan hoursAmount = new TimeSpan();

            foreach (var p in presenzeTotali)
            {
                var dailyHours = p.Uscita - p.Ingresso;
                if (dailyHours != null)
                {
                    hoursAmount += dailyHours;
                }
            }

            return Math.Round(hoursAmount.TotalHours, 2);
        }

        public double TotaleOreLezioni(int idStudente)
        {
            var studente = _context.Studenti.Find(idStudente);
            var id_calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == studente.IdCorso && c.Anno == studente.AnnoFrequentazione).IdCalendario;
            var lezioni = _context.Lezioni.Where(l => l.IdCalendario == id_calendario && l.Data <= DateTime.Now);
            TimeSpan totOreLezioni = new TimeSpan();

            foreach (var l in lezioni)
            {
                totOreLezioni += l.OraFine - l.OraInizio;
            }

            return totOreLezioni.TotalHours;
        }
    }
}