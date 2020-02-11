﻿using System;
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
    public class CorsiController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public CorsiController(AvocadoDBContext context)
        {
            _context = context;
        }

        // GET: api/Corsi
        [HttpGet]
        public IEnumerable<Corsi> GetCorsi()
        {
            return _context.Corsi;
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
            
            return Ok(corsi);
        }

        // GET: api/Corsi/GetCorsiByDocente/IdDoc
        [HttpGet("[action]/{IdDoc}")]
        public async Task<IActionResult> GetCorsiByDocente([FromRoute] int IdDoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var cor = _context.Tenere.Where(d => d.IdDocente == IdDoc);

            var corso = new List<Tuple<int, string>>();


            foreach (var item in cor)
            {
                var c = await _context.Corsi.FindAsync(item.IdCorso);
                corso.Add(new Tuple<int, string>(item.IdCorso, c.Nome));
            }

            return Ok(corso);
        }

        // PUT: api/Corsi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCorsi([FromRoute] int id, [FromBody] Corsi corsi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != corsi.IdCorso)
            {
                return BadRequest();
            }

            var com = _context.Comprende.Where(c => c.IdCorso == id);
            _context.Comprende.RemoveRange(com);

            _context.Comprende.AddRange(corsi.Comprende);

            _context.Entry(corsi).State = EntityState.Modified;

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
        public async Task<IActionResult> PostCorsi([FromBody] Corsi corsi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cor = _context.Corsi.Last();
            if (cor == null)
            {
                return CreatedAtAction("GetCorsi", "Corso inesistente");
            }

            foreach (var item in corsi.Comprende)
            {
                item.IdCorso = cor.IdCorso;
            }
            _context.Comprende.AddRange(corsi.Comprende);

            _context.Corsi.Add(corsi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCorsi", new { id = corsi.IdCorso }, corsi);
        }

        // DELETE: api/Corsi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCorsi([FromRoute] int id)
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

            var com = _context.Comprende.Where(c => c.IdCorso == id);
            _context.Comprende.RemoveRange(com);
            _context.Corsi.Remove(corsi);
            await _context.SaveChangesAsync();

            return Ok(corsi);
        }

        private bool CorsiExists(int id)
        {
            return _context.Corsi.Any(e => e.IdCorso == id);
        }
    }
}