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

            var admin = await _context.Amministratori.SingleOrDefaultAsync(a => a.Username == amministratore.username && a.Password == amministratore.password);

            if (admin == null)
            {
                return Ok("errore");
            }

            return Ok(admin);
        }

    }
}