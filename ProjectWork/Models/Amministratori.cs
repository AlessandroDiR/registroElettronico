using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Amministratori
    {
        public Amministratori()
        {
            Amministrare = new HashSet<Amministrare>();
        }

        public int IdAdmin { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string Password { get; set; }
        public string UltimoLog { get; set; }

        public ICollection<Amministrare> Amministrare { get; set; }
    }
}
