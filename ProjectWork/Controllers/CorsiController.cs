using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.CustomizedModels;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CorsiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public CorsiController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Corsi
        [HttpGet]
        public IActionResult GetCorsi()
        {
            var corsi = _context.Corsi;
            var result = new List<object>();

            foreach(var c in corsi)
            {
                var json = new
                {
                    idCorso = c.IdCorso,
                    nome = c.Nome,
                    luogo = c.Luogo,
                    logo = c.Logo
                };
                result.Add(json);
            }

            return Ok(result);
        }

        // GET: api/Corsi/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCorsi([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var corsi = await _context.Corsi.FindAsync(id);

            if (corsi == null)
            {
                return NotFound();
            }

            var json = new
            {
                idCorso = corsi.IdCorso,
                nome = corsi.Nome,
                luogo = corsi.Luogo,
                logo = corsi.Logo
            };
            
            return Ok(json);
        }

        // GET: api/Corsi/GetCorsiByDocenti/IdDoc
        [HttpGet("[action]/{IdDoc}")]
        public IActionResult GetCorsiByDocenti([FromRoute] int IdDoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var tenere = _context.Tenere.Where(d => d.IdDocente == IdDoc);

            var corso = _context.Corsi.Where(c => tenere.Any(t => t.IdCorso == c.IdCorso));

            return Ok(corso);
        }

        [HttpGet("[action]/{idCorso}/{anno}")]
        public IActionResult GetStageValue([FromRoute] int idCorso, int anno)
        {
            var corso = _context.Corsi.SingleOrDefault(c => c.IdCorso == idCorso);
            if (anno == 1)
                return Ok(corso.StagePrimoAnno);
            if (anno == 2)
                return Ok(corso.StageSecondoAnno);

            return BadRequest();
        }


        // POST: api/Corsi/GeneraCodiceAnno
        [HttpPost("[action]")]
        public async Task<IActionResult> GeneraCodiceAnno([FromBody] GeneraCodiceAnnoModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = await _context.Coordinatori.SingleOrDefaultAsync(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            var corso = await _context.Corsi.SingleOrDefaultAsync(c => c.IdCorso == coordinatore.IdCorso);

            if (corso == null)
            {
                return NotFound();
            }

            if (obj.Anno == 1)
            {
                corso.CodicePrimoAnno = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
                _context.Corsi.Update(corso);
                _context.SaveChanges();
                return Ok(corso.CodicePrimoAnno);
            }
                
            else if (obj.Anno == 2)
            {
                corso.CodiceSecondoAnno = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
                _context.Corsi.Update(corso);
                _context.SaveChanges();
                return Ok(corso.CodiceSecondoAnno);
            }
                
            return NotFound();

        }

        // POST: api/Corsi/SwitchAbilitaStage
        [HttpPost("[action]")]
        public async Task<IActionResult> SwitchAbilitaStage([FromBody] GeneraCodiceAnnoModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = await _context.Coordinatori.SingleOrDefaultAsync(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            var corso = await _context.Corsi.SingleOrDefaultAsync(c => c.IdCorso == coordinatore.IdCorso);

            if (obj.Anno == 1)
                corso.StagePrimoAnno = !corso.StagePrimoAnno;
            if (obj.Anno == 2)
                corso.StageSecondoAnno = !corso.StageSecondoAnno;

            try
            {
                _context.Corsi.Update(corso);
                _context.SaveChanges();

                return Ok("success");
            }
            catch
            {
                return StatusCode(500, "salvataggio non riuscito");
            }
        }

        // PUT: api/Corsi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCorsi([FromRoute] int id, [FromBody] PostCorsiModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = _context.Amministratori.SingleOrDefault(a => a.IdAmministratore == obj.AuthAdmin.IdAdmin &&  a.Password == obj.AuthAdmin.Password);
            if (admin == null)
                return NotFound();

            if (id != obj.Corso.IdCorso)
            {
                return BadRequest();
            }

            var corso = _context.Corsi.Find(id);

            if (obj.Corso.Codice == null)
                obj.Corso.Codice = corso.Codice;

            var t = _context.Tenere.Where(c => c.IdCorso == id);
            _context.Tenere.RemoveRange(t);
             _context.Tenere.AddRange(obj.Corso.Tenere);

            var com = _context.Comprende.Where(c => c.IdCorso == id);
            _context.Comprende.RemoveRange(com);
            _context.Comprende.AddRange(obj.Corso.Comprende);

            _context.Remove(corso);
            _context.Entry(obj.Corso).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CorsiExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Corsi
        [HttpPost]
        public async Task<IActionResult> PostCorsi([FromBody] PostCorsiModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = _context.Amministratori.SingleOrDefault(a => a.IdAmministratore == obj.AuthAdmin.IdAdmin && a.Password == obj.AuthAdmin.Password);
            if (admin == null)
                return NotFound();

            if (obj.Corso.Codice == null)
                obj.Corso.Codice = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

            var cor = _context.Corsi.Last();
            if (cor == null)
            {
                return CreatedAtAction("GetCorsi", "Corso inesistente");
            }
            foreach (var item in obj.Corso.Tenere)
            {
                item.IdCorso = obj.Corso.IdCorso;
            }
            _context.Tenere.AddRange(obj.Corso.Tenere);
            foreach (var item in obj.Corso.Comprende)
            {
                item.IdCorso = cor.IdCorso;
            }
            _context.Comprende.AddRange(obj.Corso.Comprende);

            _context.Corsi.Add(obj.Corso);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCorsi", new { id = obj.Corso.IdCorso }, obj.Corso);
        }

        private bool CorsiExists(int id)
        {
            return _context.Corsi.Any(e => e.IdCorso == id);
        }
    }
}