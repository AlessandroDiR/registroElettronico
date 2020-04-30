using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]")]
    [ApiController]
    public partial class FirmaController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public FirmaController(AvocadoDBContext context)
        {
            _context = context;
        }

        //POST: api/Firma/Accedi
        [HttpPost("[action]")]
        public async Task<IActionResult> Accedi([FromBody] AccessoFirmaModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var corso = await _context.Corsi.SingleOrDefaultAsync(c => obj.IdCorso == c.IdCorso && obj.Codice == c.Codice);

            if (corso == null)
                return Ok("error");

            return Ok("success");
        }

        // POST: api/Firma
        [HttpPost]
        public IActionResult Post([FromBody] FirmaModel firma)
        {
            var studente = _context.Studenti.Where(s => s.IdCorso == firma.idCorso && s.AnnoFrequentazione == firma.anno).SingleOrDefault(s => s.Codice == firma.code);
            if(studente != null)
                return Ok(FirmaStudente(studente));
            else
            {
                var docente = _context.Docenti.SingleOrDefault(d => d.Codice == firma.code);
                if (docente != null)
                    return Ok(FirmaDocente(docente, firma.idCorso, firma.anno));
            }

            return Ok(OutputMsg.generateMessage("Errore!", "Il codice non è valido!", true));
        }

        public string FirmaStudente(Studenti s)
        {
            var date = DateTime.UtcNow;
            var time = TimeSpan.Parse(date.TimeOfDay.ToString().Split('.')[0]);
            var calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == s.IdCorso && c.Anno == s.AnnoFrequentazione);
            var lesson = _context.Lezioni.Where(l => l.Data == date && calendario.IdCalendario == l.IdCalendario).ToList();

            if (lesson != null)
            {
                var count = 0;
                foreach (var l in lesson)
                {
                    var presenza = _context.Presenze.SingleOrDefault(p => p.IdLezione == l.IdLezione && p.IdStudente == s.IdStudente);
                    if (presenza != null && presenza.Ingresso != null && presenza.Uscita != new TimeSpan(0, 0, 0) && count == lesson.Count() - 1 )
                    {
                        return OutputMsg.generateMessage("Attenzione!", "Non ci sono più lezioni!", true);
                    }
                    else
                    {
                        if (time > l.OraFine && time <= l.OraFine.Add(new TimeSpan(0,30,0)))
                        {
                            if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                            {
                                presenza.Uscita = l.OraFine;
                                _context.SaveChanges();
                                return OutputMsg.generateMessage("USCITA", $"Arrivederci {s.Nome}!");
                            }
                        }
                        else if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                        {
                            presenza.Uscita = time >= (l.OraFine - new TimeSpan(0, 10, 0)) ? l.OraFine : time;
                            _context.SaveChanges();
                            return OutputMsg.generateMessage("USCITA", $"Arrivederci {s.Nome}!");
                        }
                        else if (presenza == null && l.OraFine >= time)
                        {
                            var newPresenza = new Presenze
                            {
                                IdLezione = l.IdLezione,
                                IdStudente = s.IdStudente,
                                Ingresso = time <= (l.OraInizio + new TimeSpan(0, 10, 0)) ? l.OraInizio : time
                            };

                            _context.Presenze.Add(newPresenza);
                            _context.SaveChanges();
                            return OutputMsg.generateMessage("ENTRATA", $"Ben arrivato {s.Nome}!");
                        }
                    }
                    count += 1;
                }
            }

            return OutputMsg.generateMessage("Spiacente!", "Non ci sono lezioni oggi!", true);
        }

        public string FirmaDocente(Docenti d, int idCorso, int anno)
        {
            var date = DateTime.UtcNow;
            var time = TimeSpan.Parse(date.TimeOfDay.ToString().Split('.')[0]);
            var calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == idCorso && c.Anno == anno);
            var lesson = _context.Lezioni.Where(l => l.Data == date && calendario.IdCalendario == l.IdCalendario).ToList();

            if (lesson != null)
            {
                foreach (var l in lesson)
                {
                    var count = 0;
                    if(CheckDocenteLezione(d, l))
                    {
                        var presenza = _context.PresenzeDocente.SingleOrDefault(p => p.IdLezione == l.IdLezione && p.IdDocente == d.IdDocente);
                        if (presenza != null && presenza.Ingresso != null && presenza.Uscita != new TimeSpan(0, 0, 0) && lesson[count + 1] == null)
                        {
                            return OutputMsg.generateMessage("Attenzione!", "Hai già la firmato le lezioni di oggi!", true);
                        }
                        else
                        {
                            if (l.OraFine < time)
                            {
                                if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                                {
                                    presenza.Uscita = l.OraFine;
                                    _context.SaveChanges();
                                    return OutputMsg.generateMessage("USCITA", $"Arrivederci {d.Nome}!");
                                }
                            }
                            else if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                            {
                                presenza.Uscita = time >= (l.OraFine - new TimeSpan(0, 10, 0)) ? l.OraFine : time;
                                _context.SaveChanges();
                                return OutputMsg.generateMessage("USCITA", $"Arrivederci {d.Nome}!");
                            }
                            else if (presenza == null && l.OraFine >= time)
                            {
                                var newPresenza = new PresenzeDocente
                                {
                                    IdLezione = l.IdLezione,
                                    IdDocente = d.IdDocente,
                                    Ingresso = time <= (l.OraInizio + new TimeSpan(0, 10, 0)) ? l.OraInizio : time
                                };

                                _context.PresenzeDocente.Add(newPresenza);
                                _context.SaveChanges();
                                return OutputMsg.generateMessage("ENTRATA", $"Buona lezione {d.Nome}!");
                            }

                        }
                    }
                    count += 1;
                }
            }

            return OutputMsg.generateMessage("Spiacente!", "Nessuna lezione da tenere oggi!", true);
        }

        private bool CheckDocenteLezione(Docenti d, Lezioni l)
        {
            return _context.Insegnare.Any(i => i.IdDocente == d.IdDocente && i.IdMateria == l.IdMateria);
        }

    }
}
