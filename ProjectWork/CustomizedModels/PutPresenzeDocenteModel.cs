using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectWork.Models;

namespace ProjectWork.CustomizedModels
{
    public class PutPresenzeDocenteModel
    {
        public AuthCoordinatoreModel AuthCoordinatore { get; set; }
        public int IdPresenza { get; set; }
        public int IdLezione { get; set; }
        public int IdDocente { get; set; }
        public DateTime Ingresso { get; set; }
        public DateTime Uscita { get; set; }
    }
}
