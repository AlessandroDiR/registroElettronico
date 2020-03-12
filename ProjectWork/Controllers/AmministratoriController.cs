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
    public class AmministratoriController : ControllerBase
    {
        private readonly AvocadoDBContext _context;

        public AmministratoriController(AvocadoDBContext context)
        {
            _context = context;
        }

        // POST: api/Amministratori/LoginAmministratori
        [HttpPost("[action]")]
        public async Task<IActionResult> LoginAmministratori([FromBody] CredenzialiModel amministratore)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = _context.Amministratori.Where(a => a.Username == amministratore.username);

            if (admin == null)
            {
                return CreatedAtAction("GetDocenti", false);
            }
            else
            {
                foreach (var item in admin)
                {
                    if (item.Password == amministratore.password)
                    {
                        return Ok(item);
                    }
                }
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAmministratori", false);
        }

    }
}