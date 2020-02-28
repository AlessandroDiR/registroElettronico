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
        private readonly utilities _ut = new utilities();

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
                    password = d.Password,
                    ritirato = bool.Parse(d.Ritirato),
                    corsi = getCorsiDocente(d.IdDocente),
                    monteOre = getMonteOre(d.IdDocente)
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
                password = docente.Password,
                ritirato = bool.Parse(docente.Ritirato),
                corsi = getCorsiDocente(id),
                materie = getMaterieocente(id),
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

        // GET: api/docenti/getlezionidocente/1
        [HttpGet("[action]/{idDocente}")]
        public async Task<IActionResult> GetLezioniDocente([FromRoute] int idDocente)
        {
            var lezioniTenute = _context.PresenzeDocente.Where(p => p.IdDocente == idDocente);
            var result = new List<object>();

            foreach(var lezione in lezioniTenute)
            {
                lezione.IdLezioneNavigation = _context.Lezioni.Find(lezione.IdLezione);
                var json = new
                {
                    idPresenza = lezione.IdPresenza,
                    idDocente = lezione.IdDocente,
                    data = _context.Lezioni.FirstOrDefault(l => l.IdLezione == lezione.IdLezioneNavigation.IdLezione).Data,
                    idLezione = lezione.IdLezioneNavigation.IdLezione,
                    lezione = lezione.IdLezioneNavigation.Titolo,
                    ingresso = lezione.Ingresso,
                    uscita = lezione.Uscita
                };
                result.Add(json);
            }

            return Ok(result);
        }

        // GET: api/Docenti/firma/codice
        [HttpGet("[action]/{code}")]
        public string Firma([FromRoute] string code)
        {
            if (_ut.CheckCode(Encoder.encode(code)) != "docente")
            {
                return OutputMsg.generateMessage("Errore", "Il codice non è valido!", true);
            }

            var docente = _context.Docenti.SingleOrDefault(d => d.Cf == code);

            return SalvaFirma(docente);
        }

        private string SalvaFirma(Docenti docente)
        {
            var date = DateTime.Now;
            var time = TimeSpan.Parse(date.TimeOfDay.ToString().Split('.')[0]);

            var lesson = _context.Lezioni.Where(l => l.Data == date);

            if(lesson != null)
            {
                foreach(var l in lesson)
                {
                    var presenza = _context.PresenzeDocente.SingleOrDefault(p => p.IdLezione == l.IdLezione && p.IdDocente == docente.IdDocente);
                    if (presenza != null && presenza.Ingresso != null && presenza.Uscita != new TimeSpan(0, 0, 0))
                    {
                        return OutputMsg.generateMessage("Attenzione!", "Hai già la firmato la lezione!", true);
                    }
                    else
                    {
                        if(l.OraFine < time)
                        {
                            if(presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                            {
                                presenza.Uscita = l.OraFine;
                                _context.SaveChanges();
                                return OutputMsg.generateMessage("Ok", $"Arrivederci {docente.Nome}!");
                            }
                            else if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                            {
                                presenza.Uscita = time;
                                _context.SaveChanges();
                                return OutputMsg.generateMessage("Ok", $"Arrivederci {docente.Nome}!");
                            }
                            else if (presenza == null && l.OraFine >= time)
                            {
                                var newPresenza = new PresenzeDocente
                                {
                                    IdLezione = l.IdLezione,
                                    IdDocente = docente.IdDocente,
                                    Ingresso = time <= (l.OraInizio + new TimeSpan(0, 10, 0)) ? l.OraInizio : time
                                };

                                _context.PresenzeDocente.Add(newPresenza);
                                _context.SaveChanges();
                                return OutputMsg.generateMessage("Ok", $"Ben arrivato {docente.Nome}!");
                            }
                        }
                    }
                }
            }

            return OutputMsg.generateMessage("Spiacente", "Non ci sono lezioni oggi!", true);

        }

        private bool CheckCode(string code)
        {
            var decoded = Encoder.decode(code);
            var docente = _context.Docenti.FirstOrDefault(d => d.Cf == decoded);

            return docente != null ? true : false;
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
            docente.Password = d.Cf;
            docente.Email = d.Email;

            //var doc = _context.Docenti.Last();
            //if (doc == null)
            //{
            //    return CreatedAtAction("GetDocenti", "Docente inesistente");
            //}
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

        private List<int> getMaterieocente(int idDocente)
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
            var presenze = _context.PresenzeDocente.Where(p => p.IdDocente == idDocente);
            var totOre = new TimeSpan();

            foreach(var p in presenze)
            {
                totOre += p.Uscita - p.Ingresso;
            }

            return Math.Round(totOre.TotalHours, 2);
        }

        private bool DocentiExists(int id)
        {
            return _context.Docenti.Any(e => e.IdDocente == id);
        }
    }
}