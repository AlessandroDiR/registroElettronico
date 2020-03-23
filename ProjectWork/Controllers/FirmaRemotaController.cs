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
    public class FirmaRemotaController : ControllerBase
    {
        private readonly AvocadoDBContext _context;
        private readonly FirmaController _firma;
        private readonly EmailSender _es;

        public FirmaRemotaController(AvocadoDBContext context)
        {
            _context = context;
            _firma = new FirmaController(context);
            _es = new EmailSender();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AccessoRemoto([FromBody] string codice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var corso = await _context.Corsi.SingleOrDefaultAsync(c => codice == c.CodicePrimoAnno || codice == c.CodiceSecondoAnno);
            var anno = 0;

            if (corso == null)
                return Ok("error");

            if (codice == corso.CodicePrimoAnno)
                anno = 1;
            if (codice == corso.CodiceSecondoAnno)
                anno = 2;

            return RedirectToAction("GetStudenti", "Studenti", new { idCorso = corso.IdCorso, anno });
        }

        // POST: api/FirmaRemota
        [HttpPost]
        public IActionResult Post([FromBody] FirmaRemotaModel firma)
        {
            var studente = _context.Studenti.SingleOrDefault(s => s.IdStudente == firma.IdStudente && s.Password == firma.Password);
            if (studente != null)
                return Ok(_firma.FirmaStudente(studente));

            return Ok(OutputMsg.generateMessage("Errore!", "Il codice non è valido!", true));
        }

        [HttpPost]
        public IActionResult RichiestaCodice([FromBody] int idStudente)
        {
            var s = _context.Studenti.Find(idStudente);
            if (s == null)
                return NotFound();

            s.Password = Guid.NewGuid().ToString().Split('-')[0];
            _context.Studenti.Update(s);
            _context.SaveChanges();

            _es.SendCredenzialiAccessoRemoto(s.Email, s.Password);

            return Ok("success");
        }
    }
}