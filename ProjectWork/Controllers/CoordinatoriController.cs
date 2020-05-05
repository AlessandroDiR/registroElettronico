using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using ProjectWork.classi;
using ProjectWork.CustomizedModels;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoordinatoriController : ControllerBase
    {
        private readonly AvocadoDBContext _context;
        private readonly EmailSender _es;

        public CoordinatoriController(AvocadoDBContext context)
        {
            _context = context;
            _es = new EmailSender();
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
                    idCorso = c.IdCorso,
                    corso = _context.Corsi.SingleOrDefault(corso => corso.IdCorso == c.IdCorso).Nome
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

            return Ok(coordinatori);
        }

        // PUT: api/Coordinatori/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCoordinatore([FromRoute] int id, [FromBody] PostCoordinatoriModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = _context.Amministratori.SingleOrDefault(a => a.IdAmministratore == obj.AuthAdmin.IdAdmin && a.Password == obj.AuthAdmin.Password);
            if (admin == null)
                return NotFound();

            if (id != obj.Coordinatore.IdCoordinatore)
            {
                return BadRequest();
            }

            var coord = await _context.Coordinatori.SingleOrDefaultAsync(i => i.IdCoordinatore == id);

            if(obj.Coordinatore.Username==null)
                obj.Coordinatore.Username = coord.Username;
            if(obj.Coordinatore.Password==null)
                obj.Coordinatore.Password = coord.Password;

            _context.Remove(coord);
            _context.Entry(obj.Coordinatore).State = EntityState.Modified;

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

            var coord = await _context.Coordinatori.SingleOrDefaultAsync(d => string.Compare(d.Username, cred.username, false) == 0 && string.Compare(d.Password, cred.password, false) == 0);

            if (coord == null)
            {
                return Ok("error");
            }

            var json = new
            {
                idCoordinatore = coord.IdCoordinatore,
                idCorso = coord.IdCorso,
                codiceCorso = _context.Corsi.Find(coord.IdCorso).Codice,
                nome = coord.Nome,
                cognome = coord.Cognome
            };

            return Ok(json);
        }

        // POST: api/Coordinatori
        [HttpPost]
        public async Task<IActionResult> PostCoordinatori([FromBody] PostCoordinatoriModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = _context.Amministratori.SingleOrDefault(a => a.IdAmministratore == obj.AuthAdmin.IdAdmin && a.Password == obj.AuthAdmin.Password);
            if (admin == null)
                return NotFound();

            Coordinatori coor = new Coordinatori();
            coor.Nome = obj.Coordinatore.Nome;
            coor.Email = obj.Coordinatore.Email;
            coor.IdCorso = obj.Coordinatore.IdCorso;
            coor.Cognome = obj.Coordinatore.Cognome;
            coor.Username = obj.Coordinatore.Nome + "." + obj.Coordinatore.Cognome;
            coor.Password = Cipher.encode(string.Format("{0}{1}{2}{3}{4}{5}", DateTime.UtcNow.ToLocalTime().Day, coor.Nome.Substring(0, 2), coor.IdCorso, DateTime.UtcNow.ToLocalTime().DayOfYear, coor.Cognome.Substring(0, 2), DateTime.UtcNow.ToLocalTime().Second));

            _context.Coordinatori.Add(coor);

            await _context.SaveChangesAsync();
            int id = _context.Coordinatori.Last().IdCoordinatore;
            _context.Coordinatori.Last().Username = obj.Coordinatore.Nome + "." + obj.Coordinatore.Cognome + id;
            await _context.SaveChangesAsync();

            var corsoCoordinato = _context.Corsi.Find(coor.IdCorso);

            _es.SendEmail(_context.Coordinatori.Last(), corsoCoordinato);

            return CreatedAtAction("GetCoordinatori", _context.Coordinatori.Last());
        }

        // POST: api/Coordinatori/RecuperoCoordinatori
        [HttpPost("[action]")]
        public async Task<IActionResult> RecuperoCoordinatori([FromBody] RecPwd_CoordinatoreEmail obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coord = _context.Coordinatori.FirstOrDefault(c => obj.Email == c.Email);

            if (coord == null)
            {
                return NotFound("Email coordinatore non trovata");
            }

            int Codice = int.Parse(DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString().Substring(5, 5));

            string subject = "FITSTIC | Recupero Password";
            string body = $"Ciao! Ecco il codice che dovrai inserire per recuperare la password: <strong>{Codice}</strong>. Il codice ha una durata di 5 minuti.";

            EmailSender es = new EmailSender();
            if(es.SendEmailTo(obj.Email, subject, body) == "success")
            {
                RecPwdCoordinatore rec = new RecPwdCoordinatore
                {
                    IdCoordinatore = coord.IdCoordinatore,
                    DataRichiesta = DateTime.UtcNow.ToLocalTime(),
                    Codice = Codice
                };
                _context.RecPwdCoordinatore.Add(rec);
                await _context.SaveChangesAsync();
            }else
            {
                return BadRequest("Impossibile inviare la mail");
            }


            return Ok(coord.IdCoordinatore);
        }

        // POST: api/Coordinatori/CambioPassword
        [HttpPost("[action]")]
        public async Task<IActionResult> CambioPassword([FromBody] RecPwd_UtenteDati obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var rec = _context.RecPwdCoordinatore.LastOrDefault(c => obj.IdUtente == c.IdCoordinatore);
            
            if (rec == null)
            {
                return NotFound("Coordinatore non trovato");
            }

            if (rec.Codice != obj.Codice)
            {
                return Ok("Codice errato");
            }else if(rec.DataRichiesta.AddMinutes(5) < DateTime.UtcNow.ToLocalTime())
            {
                return Ok("Codice non più valido");
            }

            var coord = _context.Coordinatori.FirstOrDefault(c => obj.IdUtente == c.IdCoordinatore);
            if (coord == null)
            {
                return NotFound("Coordinatore non trovato");
            }

            coord.Password = obj.Password;

            _context.Entry(coord).State = EntityState.Modified;            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CoordinatoriExists(coord.IdCoordinatore))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("success");
        }

        private bool CoordinatoriExists(int id)
        {
            return _context.Coordinatori.Any(e => e.IdCoordinatore == id);
        }
    }
}