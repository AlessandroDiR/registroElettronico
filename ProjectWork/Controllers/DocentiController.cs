using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.classi;
using ProjectWork.CustomizedModels;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocentiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;
        private readonly EmailSender _es;

        public DocentiController(AvocadoDBContext context)
        {
            _context = context;
            _es = new EmailSender();
        }

        // GET: api/Docenti
        [HttpGet]
        public IActionResult GetDocenti()
        {
            var docenti = _context.Docenti;
            var result = new List<object>();
            foreach(var d in docenti)
            {
                var json = new
                {
                    idDocente = d.IdDocente,
                    nome = d.Nome,
                    cognome = d.Cognome,
                    email = d.Email,
                    cf = d.Cf,
                    ritirato = bool.Parse(d.Ritirato),
                    corsi = getCorsiDocente(d.IdDocente),
                    monteOre = getMonteOrePerAnno(d.IdDocente)
                };

                result.Add(json);
            }
            return Ok(result);
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

            var result = new
            {
                idDocente = id,
                nome = docente.Nome,
                cognome = docente.Cognome,
                email = docente.Email,
                cf = docente.Cf,
                ritirato = bool.Parse(docente.Ritirato),
                corsi = getCorsiDocente(id),
                materie = getMaterieDocente(id),
                monteOre = getMonteOre(id)
            };

            return Ok(result);
        }

        // GET: api/Docenti/GetDocentiByCorso/5
        [HttpGet("[action]/{idc}")]
        public IActionResult GetDocentiByCorso([FromRoute] int idc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tenere = _context.Tenere.Where(t => t.IdCorso == idc);

            var docente = _context.Docenti.Where(d => tenere.Any(t => t.IdDocente == d.IdDocente));

            if (docente == null)
            {
                return NotFound();
            }

            var result = new List<object>();
            foreach (var d in docente)
            {
                var json = new
                {
                    idDocente = d.IdDocente,
                    nome = d.Nome,
                    cognome = d.Cognome,
                    email = d.Email,
                    cf = d.Cf,
                    ritirato = bool.Parse(d.Ritirato),
                    corsi = getCorsiDocente(d.IdDocente),
                    monteOre = getMonteOre(d.IdDocente)
                };

                result.Add(json);
            }

            return Ok(result);
        }

        // GET: api/Docenti/GetDocentiByCf/cf
        [HttpGet("[action]/{Cf}")]
        public async Task<IActionResult> GetDocentiByCf([FromRoute] string cf)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var docente = await _context.Docenti.FirstOrDefaultAsync(d => d.Cf == cf);

            if (docente == null)
            {
                return NotFound();
            }

            var result = new
                {
                    idDocente = docente.IdDocente,
                    nome = docente.Nome,
                    cognome = docente.Cognome,
                    email = docente.Email,
                    cf = docente.Cf,
                    ritirato = bool.Parse(docente.Ritirato),
                    corsi = getCorsiDocente(docente.IdDocente),
                    monteOre = getMonteOre(docente.IdDocente)
                };

            return Ok(result);
        }

        // PUT: api/Docenti/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocenti([FromRoute] int id, [FromBody] PostDocentiModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            if (id != obj.Docente.IdDocente)
            {
                return BadRequest();
            }

            if (obj.Docente == null)
            {
                return NotFound();
            }

            var t = _context.Tenere.Where(d => d.IdDocente == id);
            _context.Tenere.RemoveRange(t);
            
            _context.Tenere.AddRange(obj.Docente.Tenere);

            var i = _context.Insegnare.Where(d => d.IdDocente == id);
            _context.Insegnare.RemoveRange(i);

            _context.Insegnare.AddRange(obj.Docente.Insegnare);

            var doc = await _context.Docenti.SingleOrDefaultAsync(a => a.IdDocente == id);

            if (obj.Docente.Password == null)
                obj.Docente.Password = doc.Password;

            if (obj.Docente.Codice == null)
                obj.Docente.Codice = doc.Codice;

            _context.Remove(doc);
            _context.Entry(obj.Docente).State = EntityState.Modified;

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

            return GetDocenti();
        }

        // POST: api/Docenti
        [HttpPost]
        public async Task<IActionResult> PostDocenti([FromBody] PostDocentiModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            Docenti docente = new Docenti
            {
                IdDocente = _context.Docenti.Count() + 1,
                Nome = obj.Docente.Nome,
                Cognome = obj.Docente.Cognome,
                Cf = obj.Docente.Cf,
                Password = Cipher.encode(obj.Docente.Cf),
                Codice = Cipher.encode(obj.Docente.Cf),
                Email = obj.Docente.Email
            };

            foreach (var item in obj.Docente.Tenere)
            {
                item.IdDocente = docente.IdDocente;
            }
            _context.Tenere.AddRange(obj.Docente.Tenere);
            foreach (var item in obj.Docente.Insegnare)
            {
                item.IdDocente = docente.IdDocente;
            }
            _context.Insegnare.AddRange(obj.Docente.Insegnare);
            _context.Docenti.Add(docente);

            await _context.SaveChangesAsync();

            return GetDocenti();
        }

        [HttpPost("[action]")]
        public IActionResult RichiestaCodice([FromBody] int idDocente)
        {
            var d = _context.Docenti.Find(idDocente);
            if (d == null)
                return NotFound();

            d.Password = Guid.NewGuid().ToString().Split('-')[0];
            _context.Docenti.Update(d);
            _context.SaveChanges();

            _es.SendCredenzialiAccessoRemoto(d.Email, d.Password);

            return Ok("success");
        }

        // PUT: api/Docenti/RitiraDocente/1
        [HttpPut("[action]")]
        public async Task<IActionResult> RitiraDocente([FromBody] RitiroDocenteModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            var docenti = await _context.Docenti.FindAsync(obj.IdDocente);
            if (docenti == null)
            {
                return NotFound();
            }

            if ((docenti.Ritirato).ToLower() == "false")
                docenti.Ritirato = "true";

            else if ((docenti.Ritirato).ToLower() == "true")
                docenti.Ritirato = "false";

            _context.Entry(docenti).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return GetDocenti();
        }


        private List<int> getCorsiDocente(int idDocente)
        {
            var getCorsi = _context.Tenere.Where(c => c.IdDocente == idDocente);
            var idCorsi = new List<int>();
            foreach (var corso in getCorsi)
            {
                idCorsi.Add(corso.IdCorso);
            }

            return idCorsi;
        }

        private List<int> getMaterieDocente(int idDocente)
        {
            var materie = _context.Insegnare.Where(i => i.IdDocente == idDocente);
            var idMaterie = new List<int>();
            foreach (var m in materie)
            {
                idMaterie.Add(m.IdMateria);
            }

            return idMaterie;
        }

        private double getMonteOre(int idDocente)
       {
            var presenze = _context.PresenzeDocente.Where(p => p.IdDocente == idDocente && p.Uscita != new TimeSpan(0, 0, 0));
            var totOre = new TimeSpan();

            foreach(var p in presenze)
            {
                totOre += p.Uscita - p.Ingresso;
            }

            return Math.Round(totOre.TotalHours, 2);
        }

        private object getMonteOrePerAnno(int idDocente)
        {
            var presenze = _context.PresenzeDocente.Where(p => p.IdDocente == idDocente && p.Uscita != new TimeSpan(0, 0, 0));
            var totOre1 = new TimeSpan();
            var totOre2 = new TimeSpan();

            var lezione = _context.Lezioni.Where(l => presenze.Any(p => p.IdLezione == l.IdLezione));

            var calendariPrimo = _context.Calendari.Where(c => lezione.Any(l => l.IdCalendario == c.IdCalendario && c.Anno == 1));

            var calendariSecondo = _context.Calendari.Where(c => lezione.Any(l => l.IdCalendario == c.IdCalendario && c.Anno == 2));

            var lezionePrimo = _context.Lezioni.Where(l => calendariPrimo.Any(p => p.IdCalendario == l.IdCalendario));

            var lezioneSecondo = _context.Lezioni.Where(l => calendariSecondo.Any(p => p.IdCalendario == l.IdCalendario));

            var presenzePrimo = _context.PresenzeDocente.Where(l => lezionePrimo.Any(p => p.IdLezione == l.IdLezione && l.Uscita != new TimeSpan(0, 0, 0) && l.IdDocente == idDocente));

            var presenzeSecondo = _context.PresenzeDocente.Where(l => lezioneSecondo.Any(p => p.IdLezione == l.IdLezione && l.Uscita != new TimeSpan(0, 0, 0) && l.IdDocente == idDocente));

            foreach (var p in presenzePrimo)
            {
                totOre1 += p.Uscita - p.Ingresso;
            }

            foreach (var p in presenzeSecondo)
            {
                totOre2 += p.Uscita - p.Ingresso;
            }


            var json = new
            {
                OrePrimo = Math.Round(totOre1.TotalHours, 2),
                OreSecondo = Math.Round(totOre2.TotalHours, 2)
            };

            return json;
        }


        private bool DocentiExists(int id)
        {
            return _context.Docenti.Any(e => e.IdDocente == id);
        }
    }
}