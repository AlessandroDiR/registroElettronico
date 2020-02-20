using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Docenti
    {
        public Docenti()
        {
            Insegnare = new HashSet<Insegnare>();
            PresenzeDocente = new HashSet<PresenzeDocente>();
            Tenere = new HashSet<Tenere>();
        }

        public int IdDocente { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string Password { get; set; }
        public string Cf { get; set; }
        public DateTime? DataNascita { get; set; }
        public string Ritirato { get; set; }
        public string Email { get; set; }

        public ICollection<Insegnare> Insegnare { get; set; }
        public ICollection<PresenzeDocente> PresenzeDocente { get; set; }
        public ICollection<Tenere> Tenere { get; set; }
    }
}
