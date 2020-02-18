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
    public class PresenzeController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public PresenzeController(AvocadoDBContext context)
        {
            _context = context;
        }

        // PUT: api/Presenze/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPresenze([FromRoute] int id, [FromBody] Presenze presenze)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != presenze.IdPresenza)
            {
                return BadRequest();
            }

            _context.Entry(presenze).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PresenzeExists(id))
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

        // DELETE: api/Presenze/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePresenze([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var presenze = await _context.Presenze.FindAsync(id);
            if (presenze == null)
            {
                return NotFound();
            }

            _context.Presenze.Remove(presenze);
            await _context.SaveChangesAsync();

            return Ok(presenze);
        }

        private bool PresenzeExists(int id)
        {
            return _context.Presenze.Any(e => e.IdPresenza == id);
        }
    }
}