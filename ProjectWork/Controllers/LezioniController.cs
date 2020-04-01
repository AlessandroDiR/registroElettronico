using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectWork.CustomizedModels;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [EnableCors("AllowAllHeaders")]
    [Route("api/[controller]")]
    [ApiController]
    public class LezioniController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public LezioniController(AvocadoDBContext context)
        {
            _context = context;            
        }

        // GET: api/lezioni
        [HttpGet]
        public IEnumerable<Lezioni> GetLezioni()
        {
            return _context.Lezioni.OrderBy(l => l.Data);
        }


        // GET: api/Lezioni/GetLezioniDocente/IdDoc
        [HttpGet("[action]/{idDocente}/{id_corso}")]
        public IActionResult GetLezioniDocente([FromRoute] int idDocente, int id_corso)
        {
            var idCalendario = _context.Calendari.Where(i => i.IdCorso == id_corso);
            var lezioniPerCorso = _context.Lezioni.Where(l => idCalendario.Any(c => c.IdCalendario == l.IdCalendario));
            var lezioniTenute = _context.PresenzeDocente.Where(p => lezioniPerCorso.Any(lpc => lpc.IdLezione == p.IdLezione && p.IdDocente == idDocente));
            var result = new List<object>();

            foreach (var lezione in lezioniTenute)
            {
                lezione.IdLezioneNavigation = _context.Lezioni.Find(lezione.IdLezione);
                var json = new
                {
                    idPresenza = lezione.IdPresenza,
                    idDocente = lezione.IdDocente,
                    data = _context.Lezioni.FirstOrDefault(l => l.IdLezione == lezione.IdLezioneNavigation.IdLezione).Data,
                    idLezione = lezione.IdLezione,
                    lezione = lezione.IdLezioneNavigation.Titolo.Split('-')[1].TrimStart(),
                    ingresso = DateTime.UtcNow.Date.Add(lezione.Ingresso),
                    uscita = DateTime.UtcNow.Date.Add(lezione.Uscita)
                };
                result.Add(json);
            }

            return Ok(result);
        }

        // GET: api/Lezioni/1/2
        [HttpGet("{idCorso}/{anno}")]
        public IActionResult GetLezioniGiornaliere([FromRoute] int idCorso, int anno)
        {
            var calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == idCorso && c.Anno == anno).IdCalendario;
            var lezioni = _context.Lezioni.Where(l => l.Data == DateTime.Today && l.IdCalendario == calendario);

            if (lezioni.Count() == 0)
                return NotFound();

            foreach(var l in lezioni)
            {
                if (l.OraInizio <= DateTime.UtcNow.TimeOfDay && l.OraFine >= DateTime.UtcNow.TimeOfDay)
                {
                    var idDocente = _context.Insegnare.SingleOrDefault(i => i.IdMateria == l.IdMateria).IdDocente;
                    var json = new
                    {
                        idLezione = l.IdLezione,
                        titolo = l.Titolo,
                        data = l.Data,
                        oraInizio = DateTime.UtcNow.Date.Add(l.OraInizio),
                        oraFine = DateTime.UtcNow.Date.Add(l.OraFine),
                        idDocente
                    };

                    return Ok(json);
                }
            }

            return Ok("Tutte le lezioni sono state svolte");
        }

        [HttpGet("[action]/{idCorso}/{anno}")]
        public IActionResult GetStudentiAtLezione([FromRoute] int idCorso, int anno)
        {
            var calendario = _context.Calendari.SingleOrDefault(c => c.IdCorso == idCorso && c.Anno == anno).IdCalendario;
            var lezioni = _context.Lezioni.Where(l => l.Data == DateTime.Today && l.IdCalendario == calendario);

            if (lezioni.Count() == 0)
                return Ok("Nessuna lezione");

            foreach(var l in lezioni)
            {
                if (l.OraInizio <= DateTime.UtcNow.TimeOfDay && l.OraFine >= DateTime.UtcNow.TimeOfDay)
                {
                    var presenze = _context.Presenze.Where(p => p.IdLezione == l.IdLezione && p.Uscita == new TimeSpan(0, 0, 0));
                    var studenti = new List<object>();

                    foreach(var p in presenze)
                    {
                        var studente = _context.Studenti.Find(p.IdStudente);
                        studenti.Add(new
                        {
                            idStudent = p.IdStudente,
                            nome = studente.Nome,
                            cognome = studente.Cognome,
                            oraIngresso = DateTime.UtcNow.Date.Add(p.Ingresso)
                        });
                    }

                    var result = new
                    {
                        lezione = new
                        {
                            idLezione = l.IdLezione,
                            titolo = l.Titolo,
                            data = l.Data,
                            oraInizio = DateTime.UtcNow.Date.Add(l.OraInizio),
                            oraFine = DateTime.UtcNow.Date.Add(l.OraFine)
                        },
                        studenti
                    };

                    return Ok(result);
                }
            }
            return Ok("Lezioni terminate");
        }

    }
}