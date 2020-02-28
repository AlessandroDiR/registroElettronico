using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Coordinatori
    {
        public Coordinatori()
        {
            Coordina = new HashSet<Coordina>();
        }

        public string IdCoordinatore { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string Cf { get; set; }
        public string Password { get; set; }
        public string UltimoLog { get; set; }

        public ICollection<Coordina> Coordina { get; set; }
    }
}
