using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    public class utilities
    {
        //AvocadoDBContext context = new AvocadoDBContext();
        private readonly AvocadoDBContext _context;

        public utilities(AvocadoDBContext context)
        {
            _context = context;
        }
        public string CheckCode(string code)
        {
            var decoded = Encoder.decode(code);
            var studente = _context.Studenti.FirstOrDefault(s => s.Cf == decoded);

            if (studente != null)
                return "studente";
            else
            {
                var docente = _context.Docenti.FirstOrDefault(d => d.Cf == decoded);
                if (docente != null)
                    return "docente";
            }

            return "null";
        }
    }
}
