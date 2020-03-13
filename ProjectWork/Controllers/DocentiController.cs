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
    public class DocentiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public DocentiController(AvocadoDBContext context)
        {
            _context = context;
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
        public async Task<IActionResult> GetDocentiByCorso([FromRoute] int idc)
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

            var doc = await _context.Docenti.SingleOrDefaultAsync(a => a.IdDocente == id);

            if (docenti.Password == null)
                docenti.Password = doc.Password;

            if (docenti.Codice == null)
                docenti.Codice = doc.Codice;

            _context.Remove(doc);
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

            return GetDocenti();
        }

        // POST: api/Docenti
        [HttpPost]
        public async Task<IActionResult> PostDocenti([FromBody] Docenti d)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Docenti docente = new Docenti();
            docente.IdDocente = _context.Docenti.Count() + 1;
            docente.Nome = d.Nome;
            docente.Cognome = d.Cognome;
            docente.Cf = d.Cf;
            docente.Password = Cipher.encode(d.Cf);
            docente.Codice = Cipher.encode(d.Cf);
            docente.Email = d.Email;

            foreach (var item in d.Tenere)
            {
                item.IdDocente = docente.IdDocente;
            }
            _context.Tenere.AddRange(d.Tenere);
            foreach (var item in d.Insegnare)
            {
                item.IdDocente = docente.IdDocente;
            }
            _context.Insegnare.AddRange(d.Insegnare);
            _context.Docenti.Add(docente);

            await _context.SaveChangesAsync();

            return GetDocenti();
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