using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
                    ingresso = lezione.Ingresso,
                    uscita = lezione.Uscita
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
                if(l.OraFine <= DateTime.Now.TimeOfDay)
                {
                    var idDocente = _context.Insegnare.SingleOrDefault(i => i.IdMateria == l.IdMateria).IdDocente;
                    var json = new
                    {
                        l,
                        idDocente
                    };

                    return Ok(json);
                }
            }

            return NoContent();
        }

    }
}