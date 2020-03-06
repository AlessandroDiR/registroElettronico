using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatoriController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public CoordinatoriController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Coordinatori
        [HttpGet]
        public IActionResult GetCoordinatori()
        {
            var coordinatori = _context.Coordinatori;
            var result = new List<object>();
            foreach (var c in coordinatori)
            {
                var json = new
                {
                    idCoordinatore = c.IdCoordinatore,
                    nome = c.Nome,
                    cognome = c.Cognome,
                    email = c.Email,
                    idCorso = c.IdCorso
                };

                result.Add(json);
            }
            return Ok(result);
        }

        // GET: api/Coordinatori/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCoordinatori([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatori = await _context.Coordinatori.FindAsync(id);

            if (coordinatori == null)
            {
                return NotFound();
            }

            var json = new
            {
                idCoordinatore = id,
                nome = coordinatori.Nome,
                cognome = coordinatori.Cognome,
                email = coordinatori.Email,
                idCorso = coordinatori.IdCorso
            };

            return Ok(coordinatori);
        }

        // PUT: api/Coordinatori/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCoordinatore([FromRoute] int id, [FromBody] Coordinatori c)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != c.IdCoordinatore)
            {
                return BadRequest();
            }

            var coord = await _context.Coordinatori.SingleOrDefaultAsync(i => i.IdCoordinatore == id);
            if(c.Username==null)
                c.Username = coord.Username;
            if(c.Password==null)
                c.Password = coord.Password;

            _context.Remove(coord);
            _context.Entry(c).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CoordinatoriExists(id))
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

        // POST: api/Coordinatori/LoginCoordinatore
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginCoordinatore([FromBody] CredenzialiModel cred)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coord = await _context.Coordinatori.SingleOrDefaultAsync(d => d.Username == cred.username && d.Password == cred.password);

            if (coord == null)
            {
                return Ok("error");
            }

            var corsoAmministrato = await _context.Coordina.SingleOrDefaultAsync(c => c.IdCoordinatore == coord.IdCoordinatore);
            var json = new
            {
                idCoordinatore = coord.IdCoordinatore,
                idCorso = corsoAmministrato.IdCorso,
                nome = coord.Nome,
                cognome = coord.Cognome
            };

            return Ok(json);
        }

        // POST: api/Coordinatori
        [HttpPost]
        public async Task<IActionResult> PostCoordinatori([FromBody] Coordinatori coordinatore)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Coordinatori coor = new Coordinatori();
            coor.Nome = coordinatore.Nome;
            coor.Email = coordinatore.Email;
            coor.IdCorso = coordinatore.IdCorso;
            coor.Cognome = coordinatore.Cognome;
            coor.Username = coordinatore.Nome + "." + coordinatore.Cognome;
            coor.Password = Cipher.encode(string.Format("{0}{1}{2}{3}{4}{5}", DateTime.Now.Day, coor.Nome.Substring(0, 2), coor.IdCorso, DateTime.Now.DayOfYear, coor.Cognome.Substring(0, 2), DateTime.Now.Second));

            _context.Coordinatori.Add(coor);

            await _context.SaveChangesAsync();
            int id = _context.Coordinatori.Last().IdCoordinatore;
            _context.Coordinatori.Last().Username = coordinatore.Nome + "." + coordinatore.Cognome + id;
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCoordinatori", _context.Coordinatori.Last());
        }

        // DELETE: api/Coordinatori/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoordinatori([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var c = await _context.Coordinatori.FindAsync(id);
            if (c == null)
            {
                return NotFound();
            }

            _context.Coordinatori.Remove(c);
            await _context.SaveChangesAsync();

            return Ok(c);
        }

        private bool CoordinatoriExists(int id)
        {
            return _context.Coordinatori.Any(e => e.IdCoordinatore == id);
        }
    }
}