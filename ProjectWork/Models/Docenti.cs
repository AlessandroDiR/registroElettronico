using System;
using System.Collections.Generic;

namespace ProjectWork.Models
{
    public partial class Docenti
    {
        public Docenti()
        {
            Insegnare = new HashSet<Insegnare>();
            Tenere = new HashSet<Tenere>();
            Valutazioni = new HashSet<Valutazioni>();
        }

        public int IdDocente { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string Password { get; set; }
        public string Cf { get; set; }
        public DateTime DataNascita { get; set; }
        public string LuogoNascita { get; set; }
        public string Email { get; set; }

        public ICollection<Insegnare> Insegnare { get; set; }
        public ICollection<Tenere> Tenere { get; set; }
        public ICollection<Valutazioni> Valutazioni { get; set; }
    }
}
