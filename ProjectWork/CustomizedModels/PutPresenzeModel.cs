using ProjectWork.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWork.CustomizedModels
{
    public class PutPresenzeModel
    {
        public AuthCoordinatoreModel AuthCoordinatore { get; set; }
        public int IdPresenza { get; set; }
        public int IdStudente { get; set; }
        public int IdLezione { get; set; }
        public DateTime Ingresso { get; set; }
        public DateTime Uscita { get; set; }
    }
}
