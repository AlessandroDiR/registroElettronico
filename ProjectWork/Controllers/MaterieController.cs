﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectWork.CustomizedModels;
using ProjectWork.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public IActionResult GetMaterie()
        {
            return Ok(_context.Materie);
        }

        // GET: api/Materie/GetMaterieById/5
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetMaterieById([FromRoute] int id)
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

        // GET: api/Materie/GetMaterieByName/5
        [HttpGet("[action]/{nome}")]
        public IActionResult GetMaterieByName([FromRoute] string nome)
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

        // GET: api/Materie/GetMaterieByDocente/IdDoc
        [HttpGet("[action]/{IdDoc}")]
        public async Task<IActionResult> GetMaterieByDocente([FromRoute] int IdDoc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var mat = _context.Insegnare.Where(d => d.IdDocente == IdDoc);

            var materie = new List<Tuple<int, string>>();


            foreach (var item in mat)
            {
                var m = await _context.Materie.FindAsync(item.IdMateria);
                materie.Add(new Tuple<int, string>(item.IdMateria, m.Nome));
            }

            return Ok(materie);
        }

        // GET: api/Materie/GetMaterieByCorso/IdCor
        [HttpGet("[action]/{IdCor}")]
        public IActionResult GetMaterieByCorso([FromRoute] int IdCor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var mat = _context.Comprende.Where(c => c.IdCorso == IdCor);

            var materie = _context.Materie.Where(m => mat.Any(c => c.IdMateria == m.IdMateria));

            return Ok(materie);
        }

        // PUT: api/Materie/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMaterie([FromRoute] int id, [FromBody] PostMaterieModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            if (id != obj.Materia.IdMateria)
            {
                return BadRequest();
            }

            _context.Entry(obj.Materia).State = EntityState.Modified;

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

            return GetMaterie();
        }

        // POST: api/Materie/1
        [HttpPost("{idCorso}")]
        public async Task<IActionResult> PostMaterie([FromRoute] int idCorso, [FromBody] PostMaterieModel obj)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var coordinatore = _context.Coordinatori.SingleOrDefault(c => c.IdCoordinatore == obj.AuthCoordinatore.IdCoordinatore && c.Password == obj.AuthCoordinatore.Password);
            if (coordinatore == null)
                return NotFound();

            _context.Materie.Add(obj.Materia);

            var newComprende = new Comprende
            {
                IdCorso = idCorso,
                IdMateria = obj.Materia.IdMateria
            };
            _context.Comprende.Add(newComprende);

            await _context.SaveChangesAsync();

            return RedirectToAction("GetMaterieByCorso", new { IdCor = idCorso });
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

            var c = _context.Comprende.Where(m => m.IdMateria == id);
            _context.Comprende.RemoveRange(c);
            var i = _context.Insegnare.Where(m => m.IdMateria == id);
            _context.Insegnare.RemoveRange(i);
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