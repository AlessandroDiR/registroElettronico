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
                return Ok(FirmaStudente(studente, null));
            else
            {
                var docente = _context.Docenti.SingleOrDefault(d => d.Codice == firma.code);
                if (docente != null)
                    return Ok(FirmaDocente(docente, firma.idCorso, firma.anno, null));
            }

            return Ok(OutputMsg.generateMessage("Errore!", "Il codice non è valido!", true));
        }

        public string FirmaStudente(Studenti s, int? idLezione)
        {
            var date = DateTime.UtcNow;
            var time = TimeSpan.Parse(date.TimeOfDay.ToString().Split('.')[0]);
            var calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == s.IdCorso && c.Anno == s.AnnoFrequentazione);
            var lezione = _context.Lezioni.Find(idLezione);

            if (lezione != null)
            {
                var presenza = _context.Presenze.SingleOrDefault(p => p.IdLezione == lezione.IdLezione && p.IdStudente == s.IdStudente);
                if (presenza != null && presenza.Ingresso != null && presenza.Uscita != new TimeSpan(0, 0, 0))
                {
                    return OutputMsg.generateMessage("Attenzione!", "Hai gia firmato l'uscita per questa lezione.", true);
                }
                else
                {
                    if (time > lezione.OraFine && time <= lezione.OraFine.Add(new TimeSpan(0,30,0)))
                    {
                        if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                        {
                            presenza.Uscita = lezione.OraFine;
                            _context.SaveChanges();
                            return OutputMsg.generateMessage("USCITA", $"Arrivederci {s.Nome}!");
                        }
                    }
                    else if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                    {
                        presenza.Uscita = time >= (lezione.OraFine - new TimeSpan(0, 10, 0)) ? lezione.OraFine : time;
                        _context.SaveChanges();
                        return OutputMsg.generateMessage("USCITA", $"Arrivederci {s.Nome}!");
                    }
                    else if (presenza == null && lezione.OraFine >= time)
                    {
                        var newPresenza = new Presenze
                        {
                            IdLezione = lezione.IdLezione,
                            IdStudente = s.IdStudente,
                            Ingresso = time <= (lezione.OraInizio + new TimeSpan(0, 10, 0)) ? lezione.OraInizio : time
                        };

                        _context.Presenze.Add(newPresenza);
                        _context.SaveChanges();
                        return OutputMsg.generateMessage("ENTRATA", $"Ben arrivato {s.Nome}!");
                    }
                }
            }

            return OutputMsg.generateMessage("Spiacente!", "Non ci sono lezioni oggi!", true);
        }

        public string FirmaDocente(Docenti d, int idCorso, int anno, int? idLezione)
        {
            var date = DateTime.UtcNow;
            var time = TimeSpan.Parse(date.TimeOfDay.ToString().Split('.')[0]);
            var calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == idCorso && c.Anno == anno);
            var lezione = _context.Lezioni.Find(idLezione);

            if (lezione != null)
            {
                if(CheckDocenteLezione(d, lezione))
                {
                    var presenza = _context.PresenzeDocente.SingleOrDefault(p => p.IdLezione == lezione.IdLezione && p.IdDocente == d.IdDocente);
                    if (presenza != null && presenza.Ingresso != null && presenza.Uscita != new TimeSpan(0, 0, 0))
                    {
                        return OutputMsg.generateMessage("Attenzione!", "Hai già firmato l'uscita per questa lezione.", true);
                    }
                    else
                    {
                        if (time > lezione.OraFine && time <= lezione.OraFine.Add(new TimeSpan(0, 30, 0)))
                        {
                            if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                            {
                                presenza.Uscita = lezione.OraFine;
                                _context.SaveChanges();
                                return OutputMsg.generateMessage("USCITA", $"Arrivederci {d.Nome}!");
                            }
                        }
                        else if (presenza != null && presenza.Ingresso != null && presenza.Uscita == new TimeSpan(0, 0, 0))
                        {
                            presenza.Uscita = time >= (lezione.OraFine - new TimeSpan(0, 10, 0)) ? lezione.OraFine : time;
                            _context.SaveChanges();
                            return OutputMsg.generateMessage("USCITA", $"Arrivederci {d.Nome}!");
                        }
                        else if (presenza == null && lezione.OraFine >= time)
                        {
                            var newPresenza = new PresenzeDocente
                            {
                                IdLezione = lezione.IdLezione,
                                IdDocente = d.IdDocente,
                                Ingresso = time <= (lezione.OraInizio + new TimeSpan(0, 10, 0)) ? lezione.OraInizio : time
                            };

                            _context.PresenzeDocente.Add(newPresenza);
                            _context.SaveChanges();
                            return OutputMsg.generateMessage("ENTRATA", $"Buona lezione {d.Nome}!");
                        }

                    }
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
