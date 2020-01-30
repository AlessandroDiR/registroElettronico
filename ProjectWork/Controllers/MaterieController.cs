using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaterieController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public MaterieController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Materie
        [HttpGet]
        public IEnumerable<Materie> GetMaterie()
        {
            return _context.Materie;
        }

        // GET: api/Materie/ID/5
        [HttpGet("ID/{id}")]
        public async Task<IActionResult> GetMaterie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var materie = await _context.Materie.FindAsync(id);

            if (materie == null)
            {
                return NotFound();
            }

            return Ok(materie);
        }

        // GET: api/Materie/Nome/5
        [HttpGet("Nome/{nome}")]
        public async Task<IActionResult> GetMaterie([FromRoute] string nome)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var materie = _context.Materie.Where(m => m.Nome == nome).FirstOrDefault();

            if (materie == null)
            {
                return NotFound();
            }

            return Ok(materie);
        }

        // PUT: api/Materie/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMaterie([FromRoute] int id, [FromBody] Materie materie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != materie.IdMateria)
            {
                return BadRequest();
            }

            _context.Entry(materie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaterieExists(id))
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

        // POST: api/Materie
        [HttpPost]
        public async Task<IActionResult> PostMaterie([FromBody] Materie materie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Materie.Add(materie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMaterie", new { id = materie.IdMateria }, materie);
        }

        // DELETE: api/Materie/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaterie([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var materie = await _context.Materie.FindAsync(id);
            if (materie == null)
            {
                return NotFound();
            }

            _context.Materie.Remove(materie);
            await _context.SaveChangesAsync();

            return Ok(materie);
        }

        private bool MaterieExists(int id)
        {
            return _context.Materie.Any(e => e.IdMateria == id);
        }
    }
}