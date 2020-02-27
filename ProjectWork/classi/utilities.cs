using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectWork.Models;

namespace ProjectWork.Controllers
{
    public class utilities
    {
        AvocadoDBContext context = new AvocadoDBContext();
        public string CheckCode(string code)
        {
            var decoded = Encoder.decode(code);
            var studente = context.Studenti.FirstOrDefault(s => s.Cf == decoded);

            if (studente != null)
                return "studente";
            else
            {
                var docente = context.Docenti.FirstOrDefault(d => d.Cf == decoded);
                if (docente != null)
                    return "docente";
            }

            return "null";
        }
    }
}
