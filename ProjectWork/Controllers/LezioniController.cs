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
            //SaveEventsInContext();
            return _context.Lezioni.OrderBy(l => l.Data);
            //return CalendarApi.GetCalendarEvents();
        }


        // GET: api/Lezioni/GetLezioniDocente/IdDoc
        [HttpGet("[action]/{idDocente}")]
        public async Task<IActionResult> GetLezioniDocente([FromRoute] int idDocente)
        {
            var lezioniTenute = _context.PresenzeDocente.Where(p => p.IdDocente == idDocente);
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
    }
}