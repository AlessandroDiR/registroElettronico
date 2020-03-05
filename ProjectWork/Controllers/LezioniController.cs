using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectWork.classi;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
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
            //SaveEventsInContext();
            return _context.Lezioni.OrderBy(l => l.Data);
            //return CalendarApi.GetCalendarEvents();
        }


        // GET: api/Lezioni/GetLezioniDocente/IdDoc
        [HttpGet("[action]/{idDocente}/{id_corso}")]
        public async Task<IActionResult> GetLezioniDocente([FromRoute] int idDocente, int id_corso)
        {
            //var materie = _context.Materie.Where(m => mat.Any(c => c.IdMateria == m.IdMateria));
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
                    idLezione = lezione.IdLezioneNavigation.IdLezione,
                    lezione = lezione.IdLezioneNavigation.Titolo,
                    ingresso = lezione.Ingresso,
                    uscita = lezione.Uscita
                };
                result.Add(json);
            }

            return Ok(result);
        }

        public void SaveEventsInContext()
        {
            var events = CalendarApi.GetCalendarEvents();
            foreach (var e in events)
            {
                var lezione = new Lezioni
                {
                    Titolo = e.summary,
                    Data = e.date,
                    OraInizio = e.start,
                    OraFine = e.end
                };

                _context.Lezioni.Add(lezione);
            }

            _context.SaveChanges();

        }


    }
}